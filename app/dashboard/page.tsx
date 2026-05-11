import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DashboardClient } from '@/components/DashboardClient';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/');
  }

  return <DashboardClient />;
}
