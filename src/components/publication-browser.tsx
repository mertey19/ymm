'use client';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Publication } from '@/data/publications';
import { PublicationCard } from './ui';
export function PublicationBrowser({ items }: { items: Publication[] }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          (!year || p.date.startsWith(year)) &&
          (!category || p.category === category) &&
          `${p.title} ${p.description}`
            .toLocaleLowerCase('tr-TR')
            .includes(query.trim().toLocaleLowerCase('tr-TR')),
      ),
    [items, query, year, category],
  );
  if (!items.length)
    return (
      <div className="empty-state">
        <h2>Henüz yayımlanmış içerik bulunmuyor</h2>
        <p>Yeni yayınlar eklendiğinde bu sayfada yer alacak.</p>
      </div>
    );
  return (
    <>
      {items.some((item) => item.demo) && (
        <div className="sample-notice">
          “Örnek içerik” olarak işaretlenen yayınlar sistemin gösterimi için hazırlanmıştır. Güncel
          mevzuat sirküleri veya kişiye özel danışmanlık niteliği taşımaz.
        </div>
      )}
      <div className="filter-bar">
        <div>
          <label htmlFor="publication-search">Yayınlarda ara</label>
          <div className="search-input">
            <Search size={18} />
            <input
              id="publication-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Başlık veya anahtar kelime"
            />
          </div>
        </div>
        <div>
          <label htmlFor="publication-year">Yıl</label>
          <select id="publication-year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Tüm yıllar</option>
            {[...new Set(items.map((p) => p.date.slice(0, 4)))]
              .sort()
              .reverse()
              .map((y) => (
                <option key={y}>{y}</option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="publication-category">Kategori</label>
          <select
            id="publication-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tüm kategoriler</option>
            {[
              ...new Set([
                'Vergi',
                'KDV',
                'Kurumlar Vergisi',
                'Gelir Vergisi',
                'SGK',
                'Teşvikler',
                'Mevzuat',
                'Finans',
                'Denetim',
                ...items.map((p) => p.category),
              ]),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="results-bar">
        <span role="status" aria-live="polite">
          {filtered.length} yayın bulundu
        </span>
        {(query || year || category) && (
          <button
            onClick={() => {
              setQuery('');
              setYear('');
              setCategory('');
            }}
          >
            Filtreleri temizle
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="publication-grid">
          {filtered.map((p) => (
              <PublicationCard key={p.slug} item={p} headingLevel={2} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Aramanıza uygun yayın bulunamadı</h2>
          <p>Farklı bir kelime deneyebilir veya filtreleri temizleyebilirsiniz.</p>
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setYear('');
              setCategory('');
            }}
          >
            Tüm yayınları göster
          </button>
        </div>
      )}
    </>
  );
}
