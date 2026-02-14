import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Menon Mobility"
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
