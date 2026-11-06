import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="text-7xl font-semibold tracking-tight text-brand">404</p>
        <h1 className="mt-3 text-2xl font-semibold">This page has gone up in smoke</h1>
        <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-on-ink">Back to home</Link>
      </div>
    </div>
  );
}
