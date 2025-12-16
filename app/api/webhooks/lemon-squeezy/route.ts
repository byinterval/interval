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

    if (eventName === 'subscription_created') {
      const email = data.user_email;
      const name = data.user_name;
      const customerId = data.customer_id;

      const docId = `member-${email.replace(/[@.]/g, '-')}`;

      await client.createOrReplace({
        _id: docId,
        _type: 'memberRegistry',
        email: email,
        name: name,
        lemonCustomerId: customerId.toString(),
        status: 'active',
        savedItems: [] 
      });
      console.log(`User ${email} synced.`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}