import { ResponsiveImage } from './responsive-image';
import Link from '@/components/site-link';
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { site as siteDefaults } from '@/config/site';
import { publicContent } from '@/lib/cms';
import { values } from '@/data/company';
import { CheckList, EmptyState, TextLink } from './ui';
import { ContactForm } from './contact-form';
export function Values() {
  return (
    <div className="values-grid">
      {values.map((x) => (
        <article key={x.title}>
          <ShieldCheck size={25} strokeWidth={1.4} />
          <h2>{x.title}</h2>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}
export function MissionVision() {
  return (
    <div className="two-col">
      <section>
        <p className="eyebrow">MİSYONUMUZ</p>
        <h2>Bilgiyi Güvene Dönüştürmek</h2>
        <p>
          İşletmelerin vergi ve finansal süreçlerini anlaşılır, izlenebilir ve düzenli bir çalışma
          çerçevesinde yönetmelerine destek olmak. Mesleki ilkeleri gözeterek her ihtiyacı kendi
          koşulları içinde değerlendirmek ve uygulanabilir öneriler sunmak.
        </p>
      </section>
      <section>
        <p className="eyebrow">VİZYONUMUZ</p>
        <h2>Uzun Vadeli Bir Çözüm Ortağı Olmak</h2>
        <p>
          Değişen iş dünyasında açık iletişim, bağımsız değerlendirme ve sürekli gelişim anlayışıyla
          güvenilir bir danışmanlık ilişkisi kurmak. İşletmelerin bugünkü ihtiyaçlarını ve
          gelecekteki hedeflerini birlikte ele alan bir yaklaşımı sürdürmek.
        </p>
      </section>
    </div>
  );
}
export async function About() {
  const { settings } = await publicContent();
  return (
    <>
      <div className="about-grid">
        <div className="about-image">
          <ResponsiveImage
            name="about"
            alt="Sade bir toplantı odasında doğal ışık ve çalışma alanı"
            priority
            sizes="(max-width:767px) 100vw, 45vw"
          />
        </div>
        <div className="about-copy">
          <p className="eyebrow">KAREN YMM</p>
          <h2>{settings.aboutTitle}</h2>
          {settings.aboutText.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div className="section">
        <MissionVision />
      </div>
      <section>
        <p className="eyebrow">DEĞERLERİMİZ</p>
        <h2 className="mb-8">Çalışmalarımızın Değişmeyen Temeli</h2>
        <Values />
      </section>
    </>
  );
}
export async function TeamPage({ isPartners = false }: { isPartners?: boolean }) {
  const { team } = await publicContent();
  const members = team.filter((x) => !isPartners || x.partner);
  if (!members.length)
    return (
      <EmptyState
        title={isPartners ? 'Ortak bilgileri hazırlanıyor' : 'Ekibimizi yakında tanıyın'}
        description="Doğrulanmış isim, unvan ve mesleki özgeçmişler tamamlandığında bu alanda paylaşılacaktır."
      />
    );
  return (
    <div className="team-grid">
      {members.map((x) => (
        <article key={x.name}>
          <h2>{x.name}</h2>
          <p>{x.title}</p>
          <p style={{ whiteSpace: 'pre-line' }}>{x.bio}</p>
        </article>
      ))}
    </div>
  );
}
export async function Contact() {
  const { settings, services } = await publicContent();
  const site = { ...siteDefaults, ...settings };
  const hasDetails = Boolean(site.phone || site.email || site.address || site.workingHours);
  return (
    <div className={`contact-grid${hasDetails && site.contactEndpoint ? '' : ' contact-single'}`}>
      {hasDetails && (
        <div className="contact-info">
          <h2>İletişim Bilgilerimiz</h2>
          {[
            { icon: MapPin, label: 'Adres', value: site.address, link: '' },
            {
              icon: Phone,
              label: 'Telefon',
              value: site.phone,
              link: site.phone ? `tel:${site.phone.replace(/\s/g, '')}` : '',
            },
            {
              icon: Mail,
              label: 'E-posta',
              value: site.email,
              link: site.email ? `mailto:${site.email}` : '',
            },
            { icon: Clock3, label: 'Çalışma Saatleri', value: site.workingHours, link: '' },
          ]
            .filter((x) => x.value.trim())
            .map((x) => (
              <div className="contact-item" key={x.label}>
                <x.icon size={21} strokeWidth={1.4} />
                <div>
                  <h3>{x.label}</h3>
                  {x.link ? <a href={x.link}>{x.value}</a> : <p>{x.value}</p>}
                </div>
              </div>
            ))}
        </div>
      )}
      {site.contactEndpoint ? (
        <ContactForm subjects={services.map((service) => service.title)} />
      ) : (
        <p className="sample-notice">Çevrimiçi mesaj gönderimi şu anda kullanıma açık değil.</p>
      )}
    </div>
  );
}
export function Career() {
  return (
    <div className="career-panel">
      <p className="eyebrow">KAREN YMM’DE KARİYER</p>
      <h2>Mesleki Gelişimi Birlikte Düşünelim</h2>
      <p>
        Dikkatli çalışma, açık iletişim ve mesleki etik, çalışma yaklaşımımızın temelini oluşturur.
        Farklı bakış açılarını ve öğrenme isteğini değerli buluruz.
      </p>
      <CheckList
        items={[
          'Mesleki etik ve gizliliğe özen',
          'Analitik düşünme ve dikkatli inceleme',
          'İş birliği ve anlaşılır iletişim',
          'Öğrenmeye ve gelişime açıklık',
        ]}
      />
      <div className="sample-notice">
        Şu anda yayımlanmış açık pozisyon bulunmuyor. Başvuru kanalları ve pozisyon bilgileri
        kesinleştiğinde bu sayfada paylaşılacaktır.
      </div>
      <TextLink href="/kurumsal/degerlerimiz">Değerlerimizi Tanıyın</TextLink>
    </div>
  );
}
export function Policy({ kind }: { kind: string }) {
  return (
    <div className="prose">
      <div className="sample-notice">
        Bu sayfa sitenin mevcut işleyişini açıklar. Şirketin doğrulanmış bilgilerini ve gerçek veri
        işleme süreçlerini içeren nihai metin, ilgili bilgiler tamamlandığında yayımlanacaktır.
      </div>
      {kind === 'cerez-politikasi' ? (
        <>
          <h2>Site Tarafından Kullanılan Teknolojiler</h2>
          <p>
            Bu uygulama reklam veya analitik çerezleri kurmaz; ziyaretçi profili oluşturmak için
            takip araçları kullanmaz. Tercihlerinizi tarayıcı depolamasına kaydetmez.
          </p>
          <h2>Barındırma ve Erişim Hizmetleri</h2>
          <p>
            Sitenin barındırma veya oturum açma hizmeti, erişim ve güvenlik işlevleri için kendi
            teknolojilerini kullanabilir. Bu hizmetlerin uygulamaları ilgili sağlayıcının
            bilgilendirmesine tabidir.
          </p>
          <h2>Tarayıcı Tercihleri</h2>
          <p>
            Çerez ve site verisi tercihlerinizi kullandığınız tarayıcının gizlilik ayarlarından
            yönetebilirsiniz.
          </p>
        </>
      ) : kind === 'kvkk' ? (
        <>
          <h2>İletişim Formunun Mevcut Durumu</h2>
          <p>
            Çevrimiçi gönderim hizmeti etkinleştirilmediği sürece forma yazılan bilgiler bu uygulama
            tarafından gönderilmez veya kalıcı olarak kaydedilmez. Form yalnızca alanların
            doğruluğunu denetler.
          </p>
          <h2>Hizmet Etkinleştirilmeden Önce</h2>
          <p>
            Veri sorumlusunun doğrulanmış kimliği ve iletişim bilgileri, işlenen veriler, işleme
            amaçları, aktarım bilgileri, toplama yöntemi, hukuki dayanak ve başvuru kanalları gerçek
            süreçler esas alınarak açıklanmalıdır. Bu bilgiler tamamlanmadan form gönderimi
            etkinleştirilmemelidir.
          </p>
          <h2>Bilgi ve İletişim</h2>
          <p>
            Doğrulanmış iletişim kanalları <Link href="/iletisim">iletişim sayfasında</Link>{' '}
            paylaşılacaktır.
          </p>
        </>
      ) : (
        <>
          <h2>Paylaştığınız Bilgiler</h2>
          <p>
            Ziyaretçilere yönelik üyelik, ödeme veya belge yükleme işlevi bulunmaz. Gönderim hizmeti
            yapılandırılmadığı sürece iletişim formuna yazılan bilgiler uygulama tarafından
            iletilmez ve kalıcı olarak saklanmaz.
          </p>
          <h2>Teknik Hizmetler</h2>
          <p>
            Yönetim paneli kullanıcı adı ve şifreyle korunur. Oturumun sürdürülmesi için zorunlu bir
            oturum çerezi kullanılır. Şifrenin özeti, süreli oturum kayıtları ve giriş denemesi
            sınırları güvenli erişim için; içerikler, taslaklar ve son kayıt zamanı ise siteyi
            güncel tutmak için saklanır.
          </p>
          <p>
            Barındırma sağlayıcısı, sitenin sunulması ve erişim güvenliği için teknik kayıtlar
            işleyebilir. Sağlayıcının veri uygulamaları kendi bilgilendirmesinde açıklanır.
          </p>
          <h2>İçerikler ve Bağlantılar</h2>
          <p>
            Yayın sistemindeki örnek içerikler açıkça işaretlenmiştir. Dış bağlantılar üzerinden
            ulaşılan hizmetlerin gizlilik koşulları ilgili hizmet sağlayıcısına aittir.
          </p>
          <h2>Güncellemeler</h2>
          <p>
            İletişim veya diğer veri işleme işlevleri etkinleştirildiğinde bu metin gerçek işleyişi
            yansıtacak biçimde güncellenmelidir.
          </p>
        </>
      )}
    </div>
  );
}
