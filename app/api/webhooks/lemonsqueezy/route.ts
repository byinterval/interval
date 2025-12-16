import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from 'next-sanity'; // Assuming Sanity as per your stack

// 1. Config: Initialize Sanity Client (The Brain)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Critical: Needs write access
  useCdn: false,
});

export async function POST(req: NextRequest) {
  try {
    // 2. Security: Clone the request to read body as text for signature verification
    const clone = req.clone();
    const eventType = req.headers.get('x-event-name');
    const signature = req.headers.get('x-signature');
    const bodyText = await clone.text();

    // 3. Verification: Check if the request is actually from Lemon Squeezy
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(bodyText).digest('hex');

    if (!signature || !crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'))) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // 4. Logic: Handle the specific event "subscription_created"
    const payload = await req.json();
    const { data } = payload;
    const { attributes } = data;
    const email = attributes.user_email;
    const name = attributes.user_name;
    const orderId = attributes.order_id.toString(); // Store this for the "Sync" check

    if (eventType === 'subscription_created') {
      // 5. Ingestion: Create/Update user in Sanity
      await client.createOrReplace({
        _type: 'subscriber',
        _id: `subscriber-${email.replace(/[@.]/g, '-')}`, // Deterministic ID
        email: email,
        name: name,
        status: 'active',
        lemonSqueezyOrderId: orderId, // The Key for the handshake
        membershipTier: 'founding_member',
        joinedAt: new Date().toISOString(),
      });
      
      console.log(`[Webhook] User ingested: ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}