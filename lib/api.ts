import { createClient } from './supabase/client';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(
    'fetchWithAuth - Session state:',
    session ? 'Present' : 'Missing'
  );

  const headers = new Headers(options.headers);
  if (session?.access_token) {
    console.log('fetchWithAuth - Access token found, adding to headers');
    headers.set('Authorization', `Bearer ${session.access_token}`);
  } else {
    console.warn('fetchWithAuth - No access token available');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
