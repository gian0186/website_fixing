import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
            B
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold">Bugalou</span>
            <span className="text-xs text-slate-500">WhatsApp Automation</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="/#features" className="hover:text-slate-900">Features</a>
          <a href="/#solutions" className="hover:text-slate-900">Oplossingen</a>
          <a href="/prijzen" className="hover:text-slate-900">Prijzen</a>
          <a href="/#resources" className="hover:text-slate-900">Resources</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Inloggen
          </a>
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
            Start gratis proef
          </button>
        </div>

      </div>
    </header>
  );
}
