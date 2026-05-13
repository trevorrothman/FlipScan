import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-zinc-100 space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900">Payment Successful!</h1>
        <p className="text-zinc-600">Your FlipScan analysis credits have been added.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all w-full justify-center">
          Start Analyzing
        </Link>
      </div>
    </div>
  );
}
