export default function SharedNoteLoading() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card/90 p-8 shadow-panel backdrop-blur md:p-12">
        <div className="h-4 w-28 rounded-full bg-muted/70" />
        <div className="mt-5 h-12 w-3/4 rounded-2xl bg-muted/70" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-5 rounded-full bg-muted/60" />
          ))}
        </div>
      </div>
    </main>
  );
}
