import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SpendingPageClient } from '@/components/SpendingPageClient';

export default async function SpendingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/');
  }

  return <SpendingPageClient />;
}
