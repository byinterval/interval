const MEMBERFUL_API_URL = `https://${process.env.MEMBERFUL_SUBDOMAIN}.memberful.com/api/graphql`;

export async function memberfulClient(query: string, variables = {}) {
  const res = await fetch(MEMBERFUL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MEMBERFUL_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("Memberful API Error:", json.errors);
    throw new Error('Failed to fetch from Memberful');
  }
  return json.data;
}