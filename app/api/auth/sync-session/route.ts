// app/api/auth/sync-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// 1. Setup Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Uses the new token we fixed
  useCdn: false, // Must be false to see data immediately
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing Order ID' }, { status: 400 });
    }

    // 2. The Wait Loop (Race Condition Fix)
    // We try 3 times to find the user, waiting 1 second between tries.
    // This gives the Webhook enough time to finish writing.
    let subscriber = null;
    
    for (let i = 0; i < 5; i++) {
        // Search for the user with this Order ID
        subscriber = await client.fetch(
            `*[_type == "subscriber" && lemonSqueezyOrderId == $orderId][0]`,
            { orderId: orderId.toString() }
        );

        if (subscriber) break; // Found them! Exit loop.
        
        // Wait 1 second before trying again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!subscriber) {
      return NextResponse.json({ message: 'Subscriber not found yet' }, { status: 404 });
    }

    // 3. Success! Return the user name to the frontend
    return NextResponse.json({
      success: true,
      user: {
        firstName: subscriber.name?.split(' ')[0] || 'Member',
        lastName: subscriber.name?.split(' ').slice(1).join(' ') || '',
        email: subscriber.email
      }
    });

  } catch (err: any) {
    console.error('Sync Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}