import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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
    const clone = req.clone();
    const eventType = req.headers.get('x-event-name');
    const signature = req.headers.get('x-signature');
    const bodyText = await clone.text();

    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(bodyText).digest('hex');

    if (!signature || !crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'))) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const payload = await req.json();
    const { data } = payload;
    const { attributes } = data;
    const email = attributes.user_email;
    const name = attributes.user_name;
    // Order ID comes as an integer, convert to string for consistency
    const orderId = attributes.order_id.toString();

    // LISTEN FOR BOTH EVENTS
    if (eventType === 'subscription_created' || eventType === 'order_created') {
      await client.createOrReplace({
        _type: 'subscriber',
        _id: `subscriber-${email.replace(/[@.]/g, '-')}`,
        email: email,
        name: name,
        status: 'active',
        lemonSqueezyOrderId: orderId,
        membershipTier: 'founding_member',
        joinedAt: new Date().toISOString(),
      });
      
      console.log(`[Webhook] User ingested via ${eventType}: ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}