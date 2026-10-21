"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            F
          </span>
          <span className="text-lg font-bold tracking-tight">
            FazPraMim
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/catalogo"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Catálogo
          </Link>
          <Link
            href="#como-funciona"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Como funciona
          </Link>
          <Link
            href="#ranking"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Ranking
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Criar conta
          </Link>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          aria-label="Menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path d="M4 4l10 10M14 4L4 14" />
            ) : (
              <>
                <path d="M2 4.5h14" />
                <path d="M2 9h14" />
                <path d="M2 13.5h14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/catalogo"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="#como-funciona"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Como funciona
            </Link>
            <Link
              href="#ranking"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Ranking
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="mt-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Criar conta
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
