import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-navy-900">Page Not Found</h1>
      <p className="text-navy-600">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
