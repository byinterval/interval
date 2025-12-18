// app/api/auth/sync-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { cookies } from 'next/headers'; // Import cookies

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

    // 1. Find the Subscriber
    // We retry a few times just in case the webhook is a millisecond slow
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

    // 2. NEW: Set the Session Cookie
    // This is the "Ticket" that keeps them logged in on other pages.
    const cookieStore = await cookies();
    
    // We set a cookie named 'interval_session' (or whatever your auth checks for)
    // We'll set a standard "is_member" flag too just to be safe.
    cookieStore.set('interval_session', subscriber._id, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 Days
    });

    // 3. Find the Latest Issue
    const latestIssue = await client.fetch(
      `*[_type == "issue"] | order(publishedAt desc)[0] {
        title,
        issueNumber,
        "slug": slug.current
      }`
    );

    // 4. Return Success
    return NextResponse.json({
      success: true,
      user: {
        firstName: subscriber.name?.split(' ')[0] || 'Member',
        lastName: subscriber.name?.split(' ').slice(1).join(' ') || '',
        email: subscriber.email
      },
      latestIssue: latestIssue || { issueNumber: '00', slug: 'latest' }
    });

  } catch (err: any) {
    console.error('Sync Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}