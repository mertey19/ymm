import Link from '@/components/site-link';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  FileCheck2,
  Landmark,
  Scale,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { Service } from '@/data/services';
import type { Publication } from '@/data/publications';
import { publicationNotice } from '@/data/publications';
export const serviceIcons = [FileCheck2, Landmark, Scale, SearchCheck, TrendingUp, ShieldCheck];
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-link">
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function ServiceCards({
  items,
  headingLevel = 3,
}: {
  items: Service[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="service-grid">
      {items.map((s, i) => {
        const Icon = serviceIcons[i % 6];
        return (
          <article className="service-card" key={s.slug}>
            <div className="card-top">
              <Icon size={29} strokeWidth={1.35} />
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <Heading>
              <Link href={`/hizmetler/${s.slug}`}>{s.title}</Link>
            </Heading>
            <p>{s.intro}</p>
            <TextLink href={`/hizmetler/${s.slug}`}>Detaylı Bilgi</TextLink>
          </article>
        );
      })}
    </div>
  );
}
export function PublicationCard({
  item,
  headingLevel = 3,
}: {
  item: Publication;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="publication-card">
      <div className="publication-meta">
        <span>{item.category}</span>
        <time dateTime={item.date}>
          {new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(item.date))}
        </time>
      </div>
      <Heading>
        <Link href={`/${item.kind}/${item.slug}`}>{item.title}</Link>
      </Heading>
      <p>{item.description}</p>
      {item.demo && <small className="sample-label">{publicationNotice}</small>}
      <TextLink href={`/${item.kind}/${item.slug}`}>Devamını Oku</TextLink>
    </article>
  );
}
export function Accordion({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="accordion">
      {items.map((x, i) => (
        <details key={x.title}>
          <summary>
            <span className="accordion-num">{String(i + 1).padStart(2, '0')}</span>
            <span>{x.title}</span>
            <ChevronDown size={18} />
          </summary>
          <p>{x.text}</p>
        </details>
      ))}
    </div>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((x) => (
        <li key={x}>
          <Check size={18} />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
export function CTA({ enabled = false }: { enabled?: boolean }) {
  if (!enabled) return null;
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">BİRLİKTE DEĞERLENDİRELİM</p>
          <h2>
            Finansal ve Vergisel Süreçlerinizi
            <br className="desktop-break" /> Güvenle Yönetin
          </h2>
          <p>
            Karen YMM’nin uzman yaklaşımıyla işletmenizin ihtiyaçlarına uygun çözümler hakkında
            bilgi alın.
          </p>
        </div>
        <Link href="/iletisim" className="button button-white">
          Bizimle İletişime Geçin
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </section>
  );
}
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="İçerik yolu" className="breadcrumb">
      <ol>
        <li>
          <Link href="/">Anasayfa</Link>
        </li>
        {items.map((x, i) => (
          <li key={i}>
            <span aria-hidden="true">/</span>
            {x.href ? (
              <Link href={x.href}>{x.label}</Link>
            ) : (
              <span aria-current="page">{x.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <Breadcrumb items={crumbs || [{ label: eyebrow }]} />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{description}</p>
        <span className="page-hero-rule" />
      </div>
    </section>
  );
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <FileCheck2 size={36} strokeWidth={1} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
