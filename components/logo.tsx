import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex items-center justify-center h-12 w-12 overflow-hidden rounded-2xl bg-card shadow-panel">
        <Image src="/icons/logo.png" alt="HB Notes" width={48} height={48} className="object-cover" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">HB Notes</p>
        <p className="text-lg font-semibold leading-none">Capture Ideas</p>
      </div>
    </div>
  );
}
