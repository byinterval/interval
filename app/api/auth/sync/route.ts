import { NextResponse } from 'next/server';
import { memberfulClient } from '@/lib/memberful';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing Order ID' }, { status: 400 });
    }

    // GraphQL Query to fetch order details
    const query = `
      query GetOrder($id: ID!) {
        order(id: $id) {
          id
          created_at
          member {
            id
            fullName
            email
            subscriptions {
              active
              plan {
                name
              }
            }
          }
        }
      }
    `;

    // Fetch from Memberful
    const data = await memberfulClient(query, { id: orderId });

    if (!data.order) {
       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const member = data.order.member;
    const planName = member.subscriptions.find((s: any) => s.active)?.plan?.name || "Member";

    // Return the verified data to the frontend
    return NextResponse.json({
      name: member.fullName || "Founding Member",
      email: member.email,
      planName: planName,
      orderId: data.order.id
    });

  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}