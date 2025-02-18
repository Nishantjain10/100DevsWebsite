import { AuthForm } from '../components/auth/AuthForm';

export function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthForm isLogin={false} />
    </div>
  );
} 