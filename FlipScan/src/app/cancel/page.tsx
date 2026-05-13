import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-zinc-100 space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900">Payment Cancelled</h1>
        <p className="text-zinc-600">No worries! You can upgrade whenever you are ready.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all w-full justify-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
