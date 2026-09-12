import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 · SAYFA BULUNAMADI</p>
      <h1>Bu sayfaya ulaşamadık.</h1>
      <p>Bağlantı değişmiş olabilir. Anasayfadan devam edebilirsiniz.</p>
      <Link href="/" className="button">
        Anasayfaya Dön
      </Link>
    </section>
  );
}
