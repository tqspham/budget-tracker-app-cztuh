import { LoginForm } from '@/components/LoginForm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (token) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Budget Tracker</h1>
        <p className="text-gray-600 text-center mb-8">Manage your spending and savings</p>
        <LoginForm />
      </div>
    </div>
  );
}
