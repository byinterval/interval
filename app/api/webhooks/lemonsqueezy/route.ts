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
    // 1. Verify Signature
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

    // 2. Parse Payload
    const payload = await req.json();
    const { data } = payload;
    
    // --- SAFETY CHECK ---
    // Only try to read user data if this is actually a subscription event
    if (eventType === 'subscription_created') {
        const { attributes } = data;
        const email = attributes.user_email.toLowerCase(); 
        const name = attributes.user_name;
        const orderId = attributes.order_id.toString(); 
        const safeId = `subscriber-${email.replace(/[^a-z0-9]/g, '-')}`;

        await client.createOrReplace({
            _type: 'subscriber',
            _id: safeId, 
            email: email, 
            name: name,
            status: 'active',
            lemonSqueezyOrderId: orderId, 
            membershipTier: 'founding_member',
            joinedAt: new Date().toISOString(),
        });
        
        console.log(`[Webhook] User ingested: ${email}`);
    }

    // For 'order_created' or anything else, we just say "Received" and do nothing.
    // This prevents the Red X.
    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}