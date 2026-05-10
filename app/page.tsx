// This is a Server Component by default in Next.js App Router.
// That means it runs on the server, not in the browser.
// No "use client" at the top = Server Component.

export default function HomePage() {
  // "export default" means this is the main thing this file exports.
  // Next.js looks for this automatically when someone visits "/"
  return (
    <main className="min-h-screen bg-bg text-text-primary">
      <h1 className="text-2xl font-bold">Job Feed</h1>
    </main>
  )
}