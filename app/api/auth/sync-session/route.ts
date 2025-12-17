// app/api/auth/sync-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing Order ID' }, { status: 400 });
    }

    // 1. Find the Subscriber (The Wait Loop)
    let subscriber = null;
    for (let i = 0; i < 5; i++) {
        subscriber = await client.fetch(
            `*[_type == "subscriber" && lemonSqueezyOrderId == $orderId][0]`,
            { orderId: orderId.toString() }
        );
        if (subscriber) break; 
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!subscriber) {
      return NextResponse.json({ message: 'Subscriber not found yet' }, { status: 404 });
    }

    // 2. NEW: Find the Latest Issue
    // We fetch the single most recent issue based on publication date
    const latestIssue = await client.fetch(
      `*[_type == "issue"] | order(publishedAt desc)[0] {
        title,
        issueNumber,
        "slug": slug.current
      }`
    );

    // 3. Return Everything
    return NextResponse.json({
      success: true,
      user: {
        firstName: subscriber.name?.split(' ')[0] || 'Member',
        lastName: subscriber.name?.split(' ').slice(1).join(' ') || '',
        email: subscriber.email
      },
      // Send the issue data to the frontend
      latestIssue: latestIssue || { issueNumber: '00', slug: 'latest' } // Fallback just in case
    });

  } catch (err: any) {
    console.error('Sync Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}