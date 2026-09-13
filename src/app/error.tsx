'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container section">
      <h1>Sayfa şu anda yüklenemiyor</h1>
      <p>Geçici bir bağlantı sorunu oluştu. Lütfen yeniden deneyin.</p>
      <button className="button" onClick={reset}>
        Yeniden dene
      </button>
    </main>
  );
}
