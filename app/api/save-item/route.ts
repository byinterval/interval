import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Initialize a client with WRITE permissions
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Protected token
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const { memberId, itemId, action } = await request.json();

    if (!memberId || !itemId) {
      return NextResponse.json({ error: 'Missing memberId or itemId' }, { status: 400 });
    }

    // 1. Find or Create the Member Registry document
    // We use a deterministic ID based on the memberId to avoid duplicates
    const docId = `member-${memberId}`;

    // Ensure the document exists
    await writeClient.createIfNotExists({
      _id: docId,
      _type: 'memberRegistry',
      memberId: memberId,
      savedItems: []
    });

    // 2. Update the document (Add or Remove item)
    if (action === 'save') {
      await writeClient
        .patch(docId)
        .setIfMissing({ savedItems: [] })
        .append('savedItems', [{ _type: 'reference', _ref: itemId, _key: itemId }]) // Use itemId as key for uniqueness check logic if needed
        .commit();
    } else if (action === 'unsave') {
      await writeClient
        .patch(docId)
        .unset([`savedItems[_ref=="${itemId}"]`])
        .commit();
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Save Item Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}