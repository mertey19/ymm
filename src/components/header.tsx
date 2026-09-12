'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import type { NavigationItem } from '@/data/navigation';
export function Wordmark() {
  return (
    <span className="wordmark">
      <span>
        KAREN<span className="wordmark-dot">.</span>
      </span>
      <small>YEMİNLİ MALİ MÜŞAVİRLİK</small>
    </span>
  );
}
export function Header({ items }: { items: NavigationItem[] }) {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  function close() {
    setMobile(false);
    setOpen(null);
  }
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          const opener = (e.target as HTMLElement).closest('.nav-item')?.querySelector('button');
          if (open) {
            setOpen(null);
            opener?.focus();
          } else {
            close();
            toggle.current?.focus();
          }
        }
      }}
    >
      <div className="container header-inner">
        <Link href="/" title="Anasayfa" onClick={close}>
          <Wordmark />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={mobile ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={mobile}
          aria-controls="main-navigation"
          onClick={() => {
            setMobile(!mobile);
            setOpen(null);
          }}
        >
          {mobile ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Ana menü"
          className={mobile ? 'main-nav mobile-open' : 'main-nav'}
        >
          {items.map((n) => (
            <div
              className="nav-item"
              key={n.label}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
              }}
            >
              {n.children ? (
                <>
                  <button
                    className={`nav-link ${n.children.some((child) => path === child.href || path.startsWith(`${child.href}/`)) ? 'active' : ''}`}
                    aria-expanded={open === n.label}
                    aria-controls={`nav-${n.label}`}
                    onClick={() => setOpen(open === n.label ? null : n.label)}
                  >
                    {n.label}
                    <ChevronDown size={12} />
                  </button>
                  <div
                    id={`nav-${n.label}`}
                    className={`dropdown ${n.label === 'Hizmetlerimiz' ? 'wide' : ''}`}
                    hidden={open !== n.label}
                  >
                    {n.children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={close}>
                        {c.label}
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={n.href}
                  className={`nav-link ${path === n.href ? 'active' : ''}`}
                  aria-current={path === n.href ? 'page' : undefined}
                  onClick={close}
                >
                  {n.label}
                </Link>
              )}
            </div>
          ))}
          <Link className="button header-cta" href="/iletisim" onClick={close}>
            Bizimle İletişime Geçin
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
