import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SavingsPageClient } from '@/components/SavingsPageClient';

export default async function SavingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/');
  }

  return <SavingsPageClient />;
}
