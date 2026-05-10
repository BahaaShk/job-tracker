// This is a Server Component — it just renders the page shell.
// The actual form logic lives in the Client Component below.
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    // Center the form both vertically and horizontally on the screen.
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}