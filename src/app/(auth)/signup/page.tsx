import { SignupForm } from '@/features/auth'

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
        <SignupForm />
      </div>
    </div>
  )
}
