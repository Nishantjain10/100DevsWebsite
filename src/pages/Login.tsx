import { AuthForm } from '../components/auth/AuthForm';

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthForm isLogin={true} />
    </div>
  );
} 