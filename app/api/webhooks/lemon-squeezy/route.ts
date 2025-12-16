import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    // 1. Validate Signature
    const rawBody = await request.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const data = payload.data.attributes;

    // 2. Handle Subscription Created
    if (eventName === 'subscription_created') {
      const email = data.user_email;
      const name = data.user_name;
      const customerId = data.customer_id;
      const orderId = data.order_id; // Use this for the Welcome page sync

      // Create/Update User in Sanity
      // We use email as the deterministic ID to avoid dupes
      const docId = `member-${email.replace(/[@.]/g, '-')}`;

      await client.createOrReplace({
        _id: docId,
        _type: 'memberRegistry',
        email: email,
        name: name,
        lemonCustomerId: customerId.toString(),
        status: 'active',
        savedItems: [] // Init empty vault
      });

      console.log(`User ${email} synced to Sanity.`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}