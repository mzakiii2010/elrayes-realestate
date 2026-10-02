export function Logo({ className }: { className?: string }) {
  return (
    <a href="#home" className={`group flex items-center gap-3 ${className ?? ''}`}>
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-lg border border-gold/40 bg-gradient-to-br from-gold/25 to-emerald/15 text-gold shadow-[0_0_24px_-6px] shadow-gold/50"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-6">
          <path
            d="M12 2.5 3 8.5v13h5.5v-6.5h7V21.5H21v-13L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="7.5" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          أوراكل <span className="text-gold">العقارية</span>
        </span>
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
          ORACLE LUXURY ESTATES
        </span>
      </span>
    </a>
  )
}
