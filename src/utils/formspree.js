/**
 * Submit a form payload to Formspree.
 * Set VITE_FORMSPREE_* in .env (see .env.example).
 */
export async function submitFormspree(endpointEnvKey, data) {
  const id = import.meta.env[endpointEnvKey];
  if (!id) {
    throw new Error(
      `Form endpoint not configured. Add ${endpointEnvKey} to your .env file.`,
    );
  }

  const url = id.startsWith('http') ? id : `https://formspree.io/f/${id}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Something went wrong. Please try again.');
  }

  return res.json().catch(() => ({ ok: true }));
}

export const FORMSPREE = {
  contact: 'VITE_FORMSPREE_CONTACT',
  customOrder: 'VITE_FORMSPREE_CUSTOM_ORDER',
  purchase: 'VITE_FORMSPREE_PURCHASE',
  techIssues: 'VITE_FORMSPREE_TECH_ISSUES',
};
