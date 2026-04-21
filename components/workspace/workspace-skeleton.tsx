export function WorkspaceSkeleton() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1700px] grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="hidden border-r border-border bg-card/70 xl:block">
          <div className="space-y-4 p-5">
            <div className="h-14 rounded-2xl bg-muted/70" />
            <div className="h-12 rounded-2xl bg-muted/70" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-muted/50" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 md:p-8">
          <div className="h-12 w-64 rounded-2xl bg-muted/70" />
          <div className="h-[55vh] rounded-[2rem] bg-muted/50" />
        </div>
      </div>
    </main>
  );
}
