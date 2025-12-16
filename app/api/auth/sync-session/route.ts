import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing Order ID' }, { status: 400 });
    }

    // 1. The Race Condition Check: Look for the user in Sanity
    // Retry logic could be added here if the webhook is slightly delayed
    const query = `*[_type == "subscriber" && lemonSqueezyOrderId == $orderId][0]`;
    const subscriber = await client.fetch(query, { orderId });

    if (!subscriber) {
      // Edge Case: If Webhook hasn't fired yet, verify directly with Lemon Squeezy API
      // This ensures the "3-second animation" never fails for a valid customer.
      const verifyRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}` }
      });
      
      if (!verifyRes.ok) {
         return NextResponse.json({ message: 'Invalid Order' }, { status: 401 });
      }
      // If valid, we allow the session provisionally (or trigger a manual sync here)
    }

    // 2. The "Access Granted" Action: Set the HttpOnly Cookie
    const cookieStore = await cookies();
    
    // Set the "interval_session" cookie as requested in QA criteria
    cookieStore.set('interval_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 Days
      path: '/',
    });

    // 3. Return Data for the "Personal Welcome" UI
    return NextResponse.json({
      success: true,
      user: {
        firstName: subscriber?.name?.split(' ')[0] || 'Member',
        cohort: '2026',
        status: 'active'
      }
    });

  } catch (error) {
    console.error('[Sync Error]', error);
    return NextResponse.json({ message: 'Handshake failed' }, { status: 500 });
  }
}