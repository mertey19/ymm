export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  intro: string;
  scope: string[];
  benefits: string[];
  audience: string;
  faq: { question: string; answer: string }[];
};
export const services: Service[] = [
  {
    slug: 'tam-tasdik',
    title: 'Tam Tasdik Hizmetleri',
    shortTitle: 'Tam Tasdik',
    intro:
      'Vergisel işlemlerinizi bütüncül bir bakışla ele alıyor, kayıt ve beyan süreçlerinizin tutarlı ve izlenebilir bir yapıya kavuşmasına destek oluyoruz.',
    scope: [
      'Muhasebe kayıtları ve dayanak belgelerin değerlendirilmesi',
      'Vergi beyannameleri ile finansal kayıtların karşılaştırılması',
      'Dönem içi kontroller ve tespitlerin raporlanması',
      'Tasdik sürecine ilişkin belge ve rapor koordinasyonu',
    ],
    benefits: [
      'Olası uyumsuzlukların erken değerlendirilmesi',
      'Kayıt ve belge düzeninde tutarlılık',
      'Yönetim için anlaşılır bulgu ve öneriler',
    ],
    audience:
      'Vergisel süreçlerini düzenli bir kontrol ve tasdik çerçevesinde yönetmek isteyen işletmeler.',
    faq: [
      {
        question: 'Tam tasdik çalışması nasıl planlanır?',
        answer:
          'İşletmenin faaliyetleri, belge düzeni ve dönemsel ihtiyaçları değerlendirilir. Çalışmanın kapsamı ve takvimi hizmet sözleşmesiyle belirlenir.',
      },
      {
        question: 'Çalışma yalnızca yıl sonunda mı yapılır?',
        answer:
          'İhtiyaca göre dönem içinde kontroller ve bilgilendirme toplantıları planlanabilir. Takvim işletmenin süreçlerine göre oluşturulur.',
      },
    ],
  },
  {
    slug: 'kdv-vergi-iadesi',
    title: 'KDV ve Vergi İade Hizmetleri',
    shortTitle: 'KDV ve Vergi İadesi',
    intro:
      'İade süreçlerinde belge hazırlığından dosya takibine kadar düzenli, şeffaf ve koordineli bir çalışma yaklaşımı sunuyoruz.',
    scope: [
      'İade talebine esas işlemlerin ön değerlendirmesi',
      'Belge ve liste hazırlığının koordinasyonu',
      'Dosya tutarlılığı ve eksik belge kontrolleri',
      'İade dosyasının takibi ve bilgilendirme',
    ],
    benefits: [
      'İzlenebilir dosya yönetimi',
      'Eksik belge riskinin azaltılmasına destek',
      'Süreç hakkında düzenli bilgi akışı',
    ],
    audience:
      'İşlemleri nedeniyle vergi iade sürecini değerlendirmek veya mevcut dosyalarını düzenlemek isteyen işletmeler.',
    faq: [
      {
        question: 'İade süresi önceden garanti edilebilir mi?',
        answer:
          'Hayır. Süre; işlemin niteliği, dosyanın durumu ve ilgili idarenin değerlendirmesine bağlıdır. Dosya ilerleyişi düzenli olarak takip edilir.',
      },
      {
        question: 'Hangi belgeler gereklidir?',
        answer:
          'Gerekli belgeler iade türüne göre değişir. Ön değerlendirmeden sonra işletmeye özel bir belge listesi hazırlanır.',
      },
    ],
  },
  {
    slug: 'vergi-danismanligi',
    title: 'Vergi Danışmanlığı',
    shortTitle: 'Vergi Danışmanlığı',
    intro:
      'Vergisel kararlarınızı işletmenizin faaliyetleri ve ihtiyaçları çerçevesinde değerlendiriyor, anlaşılır ve uygulanabilir bir danışmanlık yaklaşımı benimsiyoruz.',
    scope: [
      'Günlük vergisel soruların değerlendirilmesi',
      'Planlanan işlemlerin vergi boyutunun analizi',
      'Sözleşme ve iş akışlarının vergisel açıdan incelenmesi',
      'Mevzuat değişikliklerinin işletmeye etkisinin değerlendirilmesi',
    ],
    benefits: [
      'Karar öncesinde risklerin görünür olması',
      'Daha tutarlı vergi uygulamaları',
      'İşletmeye özel değerlendirme',
    ],
    audience:
      'Günlük faaliyetlerinde veya yeni yatırımlarında vergisel değerlendirmeye ihtiyaç duyan işletmeler.',
    faq: [
      {
        question: 'Danışmanlık sürekli veya proje bazlı olabilir mi?',
        answer:
          'Evet. İhtiyaca göre belirli bir işlem için ya da düzenli danışmanlık kapsamında çalışma planlanabilir.',
      },
      {
        question: 'Görüşler işletmeye özel mi hazırlanır?',
        answer:
          'Değerlendirmeler paylaşılan bilgi ve belgeler ile işlemin özelliklerine göre oluşturulur.',
      },
    ],
  },
  {
    slug: 'vergi-inceleme-uzlasma',
    title: 'Vergi İnceleme ve Uzlaşma',
    shortTitle: 'Vergi İnceleme ve Uzlaşma',
    intro:
      'Vergi inceleme süreçlerinde bilgi ve belgelerin düzenlenmesine, teknik konuların değerlendirilmesine ve sürecin takibine destek oluyoruz.',
    scope: [
      'İnceleme konusu ve belge taleplerinin değerlendirilmesi',
      'Bilgi ve belge hazırlığına destek',
      'Teknik açıklamaların hazırlanmasına katkı',
      'İlgili süreç ve takvimlerin koordinasyonu',
    ],
    benefits: [
      'Düzenli belge ve bilgi akışı',
      'Teknik konuların anlaşılır biçimde ele alınması',
      'Süreç adımlarının izlenebilirliği',
    ],
    audience:
      'Vergi incelemesi veya ilgili idari süreçlerde mali ve teknik destek arayan işletmeler.',
    faq: [
      {
        question: 'Her işlem için uzlaşma mümkün müdür?',
        answer:
          'Uygulanabilecek idari yollar işlemin niteliğine ve yürürlükteki düzenlemelere bağlıdır. Her dosya özel olarak değerlendirilir.',
      },
      {
        question: 'Hukuki temsil bu hizmete dahil midir?',
        answer:
          'Mali ve teknik danışmanlık kapsamı sözleşmede belirlenir. Hukuki temsil gerektiren konular ilgili hukuk uzmanlarıyla ayrıca ele alınır.',
      },
    ],
  },
  {
    slug: 'denetim',
    title: 'Denetim Hizmetleri',
    shortTitle: 'Denetim',
    intro:
      'Finansal süreçlerinizi risk ve kontrol odağında değerlendiriyor, yönetiminize açık ve uygulanabilir tespitler sunuyoruz.',
    scope: [
      'İç kontrol yapısının değerlendirilmesi',
      'Muhasebe ve raporlama süreçlerinin incelenmesi',
      'Belirlenen kapsama göre mali süreç kontrolleri',
      'Bulguların ve iyileştirme önerilerinin raporlanması',
    ],
    benefits: [
      'Kontrol noktalarının görünür olması',
      'Finansal bilgi kalitesine destek',
      'Süreç iyileştirmelerine yön veren bulgular',
    ],
    audience: 'Mali süreçlerini ve iç kontrol yapısını gözden geçirmek isteyen işletmeler.',
    faq: [
      {
        question: 'Denetimin kapsamı nasıl belirlenir?',
        answer:
          'İşletmenin ihtiyaçları, risk alanları ve raporlama beklentileri değerlendirilerek yazılı bir çalışma kapsamı hazırlanır.',
      },
      {
        question: 'Yasal bağımsız denetim hizmeti sunuluyor mu?',
        answer:
          'Yasal bağımsız denetim gerektiren çalışmaların yetki ve kapsam koşulları ayrıca değerlendirilmelidir. Bu sayfa tek başına bir yetki beyanı değildir.',
      },
    ],
  },
  {
    slug: 'mali-danismanlik',
    title: 'Mali Danışmanlık',
    shortTitle: 'Mali Danışmanlık',
    intro:
      'Finansal verilerinizi karar süreçlerinize katkı sağlayacak biçimde ele alıyor, planlama ve raporlama yapınızın gelişimine destek oluyoruz.',
    scope: [
      'Finansal raporların değerlendirilmesi',
      'Bütçe ve nakit akışı planlamasına destek',
      'Maliyet ve kârlılık analizleri',
      'Yönetim raporlama yapısının geliştirilmesi',
    ],
    benefits: [
      'Finansal görünürlüğün artırılması',
      'Planlama disiplininin güçlendirilmesi',
      'Karar süreçlerine düzenli veri desteği',
    ],
    audience: 'Bütçe, raporlama ve finansal kontrol süreçlerini geliştirmek isteyen işletmeler.',
    faq: [
      {
        question: 'Mevcut muhasebe ekibiyle çalışılabilir mi?',
        answer:
          'Çalışma, mevcut ekip ve süreçlerle koordinasyon içinde planlanır. Sorumluluklar başlangıçta netleştirilir.',
      },
      {
        question: 'Raporlama sıklığı nasıl belirlenir?',
        answer: 'İşletmenin karar alma takvimi ve veri üretme düzeni dikkate alınarak belirlenir.',
      },
    ],
  },
  {
    slug: 'kurumsal-finans',
    title: 'Kurumsal Finans Danışmanlığı',
    shortTitle: 'Kurumsal Finans',
    intro:
      'Büyüme, yatırım ve dönüşüm kararlarınızın finansal boyutunu analitik bir yaklaşımla değerlendirmenize destek oluyoruz.',
    scope: [
      'Finansal modelleme ve senaryo çalışmaları',
      'Yatırım fizibilitesinin değerlendirilmesi',
      'Finansal durum tespiti çalışmalarına destek',
      'Finansman seçeneklerinin işletme açısından analizi',
    ],
    benefits: [
      'Varsayımların ve senaryoların görünür olması',
      'Yatırım kararları için analitik çerçeve',
      'Finansal risklerin birlikte değerlendirilmesi',
    ],
    audience: 'Yatırım, büyüme veya kurumsal dönüşüm planlayan işletmeler.',
    faq: [
      {
        question: 'Finansman sağlanması garanti edilir mi?',
        answer:
          'Hayır. Danışmanlık, seçeneklerin ve finansal yapının değerlendirilmesini kapsar; finansman sağlanacağına dair garanti içermez.',
      },
      {
        question: 'Çalışmalar hangi verilere dayanır?',
        answer:
          'İşletmenin sunduğu finansal veriler, iş planı ve üzerinde mutabık kalınan varsayımlar esas alınır.',
      },
    ],
  },
  {
    slug: 'tesvik-destek',
    title: 'Teşvik ve Destek Uygulamaları',
    shortTitle: 'Teşvik ve Destek',
    intro:
      'Yatırım ve faaliyet planlarınız için ilgili destek mekanizmalarını değerlendirmeye ve başvuru süreçlerini düzenlemeye yardımcı oluyoruz.',
    scope: [
      'Faaliyet ve yatırım planının ön değerlendirmesi',
      'İlgili programların koşullarının incelenmesi',
      'Başvuru belge hazırlığına destek',
      'Uygulama ve raporlama takibinin koordinasyonu',
    ],
    benefits: [
      'Uygunluk koşullarının netleştirilmesi',
      'Başvuru hazırlığında düzen',
      'Yükümlülüklerin takibine destek',
    ],
    audience:
      'Yatırım veya faaliyetleri için destek olanaklarını değerlendirmek isteyen işletmeler.',
    faq: [
      {
        question: 'Her işletme teşviklerden yararlanabilir mi?',
        answer:
          'Uygunluk programın koşullarına ve işletmenin durumuna bağlıdır. Ön değerlendirme yapılmadan hak kazanıldığı söylenemez.',
      },
      {
        question: 'Destek onayı garanti edilir mi?',
        answer:
          'Hayır. Başvurular ilgili kurumlarca değerlendirilir. Çalışma, hazırlık ve takip desteği sağlar.',
      },
    ],
  },
  {
    slug: 'yeniden-yapilandirma',
    title: 'Yeniden Yapılandırma',
    shortTitle: 'Yeniden Yapılandırma',
    intro:
      'Kurumsal değişim süreçlerini mali ve vergisel boyutlarıyla değerlendiriyor, karar ve uygulama aşamalarına planlı destek sunuyoruz.',
    scope: [
      'Mevcut mali yapının değerlendirilmesi',
      'Birleşme, devir ve bölünme senaryolarının incelenmesi',
      'Tür değişikliği süreçlerinde mali değerlendirme',
      'Uygulama takviminin ilgili uzmanlarla koordinasyonu',
    ],
    benefits: [
      'Alternatiflerin karşılaştırılabilmesi',
      'Mali etkilerin önceden değerlendirilmesi',
      'Koordineli bir geçiş süreci',
    ],
    audience: 'Organizasyon veya şirket yapısında değişiklik planlayan işletmeler.',
    faq: [
      {
        question: 'Hangi yeniden yapılandırma seçeneği uygundur?',
        answer:
          'İş hedefleri, mali durum ve işlemin koşulları birlikte değerlendirilir. Tek bir model bütün işletmeler için uygun değildir.',
      },
      {
        question: 'Hukuki çalışmalar nasıl yürütülür?',
        answer:
          'Mali değerlendirmeler, gerektiğinde şirketin hukuk danışmanlarıyla koordinasyon içinde yürütülür.',
      },
    ],
  },
];
export const featuredServices = [
  services[0],
  services[1],
  services[2],
  services[4],
  { ...services[5], title: 'Mali ve Kurumsal Finans Danışmanlığı' },
  { ...services[7], title: 'Teşvik ve Yeniden Yapılandırma' },
];
