export type Publication = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  kind: 'sirkulerler' | 'makaleler';
  demo: boolean;
  body: { heading: string; text: string }[];
};
export const publicationNotice = 'Örnek içerik · Yayın sistemi gösterimi';
export const publications: Publication[] = [
  {
    slug: 'donem-sonu-belge-duzeni',
    title: 'Dönem sonu hazırlığında belge düzeni',
    description:
      'Mali kapanış öncesinde kayıt ve belgeleri birlikte değerlendirmek için bir hazırlık çerçevesi.',
    category: 'Vergi',
    date: '2026-09-01',
    kind: 'sirkulerler',
    demo: true,
    body: [
      {
        heading: 'Hazırlıkta ortak bir çalışma planı',
        text: 'Bu içerik, yayın sisteminin kullanımını göstermek için hazırlanmış bir örnektir; yürürlüğe giren bir düzenlemeyi duyurmaz. Dönem sonu hazırlığında ekipler arasında sorumlulukların netleştirilmesi ve belgelerin ortak bir listede takip edilmesi değerlendirilebilir.',
      },
      {
        heading: 'Kayıtların birlikte ele alınması',
        text: 'Muhasebe kayıtları ve dayanak belgelerin birlikte incelenmesi, eksik bilgi alanlarını görünür kılabilir. İşletmeye özgü kontrol kapsamı ilgili uzmanla belirlenmelidir.',
      },
    ],
  },
  {
    slug: 'kdv-iade-dosyasi-hazirligi',
    title: 'KDV iade dosyasında hazırlık ve koordinasyon',
    description:
      'Dosya hazırlığında bilgi akışını ve belge takibini düzenlemeye yönelik genel bir bakış.',
    category: 'KDV',
    date: '2026-08-25',
    kind: 'sirkulerler',
    demo: true,
    body: [
      {
        heading: 'Belge akışını planlamak',
        text: 'Bu örnek yayın güncel mevzuat bildirimi değildir. İade dosyası hazırlığında talep edilen belgelerin ilgili ekiplerle paylaşılması ve bir takip düzeni oluşturulması önem taşır.',
      },
      {
        heading: 'İşleme özel değerlendirme',
        text: 'Gerekli belgeler, kapsam ve uygulama adımları işlemin özelliklerine göre değişir. Somut bir dosya için güncel koşullar ayrıca incelenmelidir.',
      },
    ],
  },
  {
    slug: 'mevzuat-takibinde-is-akisi',
    title: 'Mevzuat takibini iş süreçleriyle buluşturmak',
    description:
      'Yeni gelişmeleri ilgili sorumlulara aktarmak ve işletme etkisini değerlendirmek için süreç yaklaşımı.',
    category: 'Mevzuat',
    date: '2026-08-12',
    kind: 'sirkulerler',
    demo: true,
    body: [
      {
        heading: 'Bilgiden değerlendirmeye',
        text: 'Bu örnek yayın herhangi bir mevzuat değişikliği iddiası içermez. Bir gelişmenin işletmeye etkisi; faaliyet türü, mevcut işlemler ve sorumluluklar birlikte ele alınarak değerlendirilmelidir.',
      },
      {
        heading: 'Takip ve iletişim',
        text: 'İlgili konuların kaydedilmesi, sorumluların belirlenmesi ve sonuçların izlenmesi bilgi akışının düzenlenmesine yardımcı olur.',
      },
    ],
  },
  {
    slug: 'finansal-kararlarda-raporlama',
    title: 'Güçlü finansal kararlar, anlaşılır raporlarla başlar',
    description: 'Yönetim raporlamasında veri, bağlam ve karar arasındaki ilişki.',
    category: 'Finans',
    date: '2026-09-03',
    kind: 'makaleler',
    demo: true,
    body: [
      {
        heading: 'Raporun sorusu ne?',
        text: 'Bir yönetim raporu yalnızca rakamları sıralamakla sınırlı kalmamalıdır. Hangi kararın destekleneceği, hangi dönemin değerlendirildiği ve verinin kapsamı açıklanmalıdır. Bu metin yayın tasarımını göstermek için hazırlanmıştır.',
      },
      {
        heading: 'Tutarlı bir değerlendirme zemini',
        text: 'Karşılaştırma dönemlerinin ve varsayımların açık olması, ekiplerin aynı veriyi aynı çerçevede yorumlamasına yardımcı olur. İşletmeye uygun rapor yapısı ihtiyaçlara göre belirlenir.',
      },
    ],
  },
  {
    slug: 'ic-kontrol-surec-yaklasimi',
    title: 'İç kontrolü günlük iş akışının bir parçası yapmak',
    description: 'Kontrol noktaları ve sorumluluklar üzerinden süreçleri yeniden düşünmek.',
    category: 'Denetim',
    date: '2026-08-20',
    kind: 'makaleler',
    demo: true,
    body: [
      {
        heading: 'İş akışını görünür kılmak',
        text: 'Bu örnek makale, yayın sisteminin gösterimi için hazırlanmıştır. İşlerin hangi sırayla ve kim tarafından yürütüldüğünü açıklayan bir süreç haritası, kontrol ihtiyacının değerlendirilmesine yardımcı olabilir.',
      },
      {
        heading: 'Sorumluluk ve takip',
        text: 'Kontrolün amacı, sorumlusu ve kayıt yöntemi açık olmalıdır. Yapılacak değerlendirme işletmenin büyüklüğü ve süreçlerine göre şekillenir.',
      },
    ],
  },
  {
    slug: 'vergi-planlamasinda-hazirlik',
    title: 'Vergisel değerlendirmede doğru soruların önemi',
    description: 'İşlem öncesinde bilgiyi toplamak ve değerlendirme kapsamını netleştirmek.',
    category: 'Vergi',
    date: '2026-08-06',
    kind: 'makaleler',
    demo: true,
    body: [
      {
        heading: 'Önce işlemi anlamak',
        text: 'Bu örnek metin belirli bir işlem için vergi görüşü içermez. Vergisel değerlendirme öncesinde işlemin amacı, tarafları, zamanlaması ve belge yapısının anlaşılması gerekir.',
      },
      {
        heading: 'Bağlamı korumak',
        text: 'Bir işlem için yapılan değerlendirme farklı koşullara doğrudan taşınmamalıdır. Görüşün dayandığı bilgi ve varsayımların açıkça ifade edilmesi sağlıklı iletişimi destekler.',
      },
    ],
  },
];
