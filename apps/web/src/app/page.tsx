export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
            >
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v12" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary">MenonTrucks</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-md">
          India&apos;s Trusted Commercial Vehicle Marketplace
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 rounded-full">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-accent-700 font-medium">Coming Soon</span>
        </div>
      </div>
    </main>
  );
}
