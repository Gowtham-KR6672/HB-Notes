import React from "react";
import { Cpu, Wifi } from "lucide-react";

export function CreditCardView({ data }: { data: string }) {
  // Parse the raw text data inside the codeblock
  const lines = data.split("\n");
  const parsedData = lines.reduce((acc, line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length > 0) {
      acc[key.trim().toLowerCase()] = rest.join(":").trim();
    }
    return acc;
  }, {} as Record<string, string>);

  const name = parsedData["name"] || "CARDHOLDER NAME";
  let rawNumber = parsedData["number"] || "•••• •••• •••• ••••";
  const expiry = parsedData["expiry"] || "MM/YY";
  const type = parsedData["type"] || "Bank Card";

  // Force space formatting on numbers if they wrote it as a single chunk
  if (!rawNumber.includes(" ") && rawNumber.length >= 16) {
    rawNumber = rawNumber.replace(/(\d{4})/g, "$1 ").trim();
  }

  return (
    <div className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col justify-between my-8 transition-transform hover:scale-[1.02]" style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(168, 85, 247, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
    }}>
      {/* Decorative gradient orb behind the glass */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-white/10 rounded-full blur-[50px] pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start w-full">
        <span className="text-white/90 text-lg sm:text-xl font-medium tracking-widest uppercase shadow-sm drop-shadow-md">
          {type}
        </span>
        <Wifi className="text-white/80 h-6 w-6 sm:h-8 sm:w-8 rotate-90 opacity-80" />
      </div>

      {/* Middle Section (Chip + Number) */}
      <div className="relative z-10 flex flex-col mt-auto mb-4 sm:mb-6">
        <div className="mb-4 sm:mb-6 text-white/90 drop-shadow-md shadow-sm opacity-90">
          <svg width="46" height="32" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="46" height="32" rx="6" fill="#D4AF37" fillOpacity="0.8" />
            <path d="M12 0V32M34 0V32M0 16H46M12 8H34M12 24H34" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="font-mono text-white text-2xl sm:text-3xl tracking-[0.14em] drop-shadow-md font-semibold font-variant-numeric:tabular-nums">
          {rawNumber}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex justify-between items-end w-full">
        <div className="flex flex-col text-white/90 drop-shadow-md">
          <span className="text-[10px] sm:text-xs uppercase opacity-70 tracking-widest mb-1.5">Cardholder</span>
          <span className="font-medium tracking-wider text-sm sm:text-[15px] uppercase truncate max-w-[200px]">
            {name}
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col text-white/90 drop-shadow-md text-right">
            <div className="flex gap-2 items-center justify-end">
              <span className="text-[8px] sm:text-[9px] uppercase leading-tight opacity-70 tracking-widest text-right">
                Valid<br/>Thru
              </span>
              <span className="font-mono font-medium tracking-widest text-sm sm:text-base">
                {expiry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
