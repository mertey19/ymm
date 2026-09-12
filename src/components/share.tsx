'use client';
import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
export function Share({ title }: { title: string }) {
  const [status, setStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        setStatus('Paylaşım tamamlandı.');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setStatus('Bağlantı kopyalandı.');
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError'))
        setStatus('Paylaşım kullanılamıyor. Adres çubuğundaki bağlantıyı kopyalayabilirsiniz.');
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus('Bağlantı kopyalandı.');
    } catch {
      setStatus('Bağlantıyı adres çubuğundan kopyalayabilirsiniz.');
    }
  }
  return (
    <div className="share-row">
      <button onClick={share}>
        <Share2 size={16} />
        Paylaş
      </button>
      <button onClick={copy}>
        {status === 'Bağlantı kopyalandı.' ? <Check size={16} /> : <Copy size={16} />}Bağlantıyı
        kopyala
      </button>
      <span role="status">{status}</span>
    </div>
  );
}
