import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 border p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  )
}
