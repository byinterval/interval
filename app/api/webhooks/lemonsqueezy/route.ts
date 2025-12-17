import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // Important: Ensures we always read the freshest data
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
    
    // --- FIX 1: Normalize Data ---
    // Emails can be messy (User@Gmail.com). We force lowercase to match IDs.
    const email = attributes.user_email.toLowerCase(); 
    const name = attributes.user_name;
    const orderId = attributes.order_id.toString(); 

    if (eventType === 'subscription_created') {
      
      // --- FIX 2: Better ID Generation ---
      // We explicitly clean the email to make a valid Sanity ID
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
      
      console.log(`[Webhook] User ingested: ${email} with ID: ${safeId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}