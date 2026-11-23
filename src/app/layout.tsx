import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactFab } from '@/components/ContactFab';
import { company } from '@/content/site';
import { SITE_URL, asset } from '@/lib/paths';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + '/'),
  title: { default: `${company.nameAr} | أبواب WPC وشبابيك UPVC والألمنيوم في الرياض`, template: `%s | ${company.shortAr}` },
  description: 'مؤسسة دلما الجزيرة للمقاولات في الرياض منذ 2011: تصنيع وتوريد وتركيب أبواب WPC وPVC، وأبواب وشبابيك UPVC، وأعمال الألمنيوم والزجاج والواجهات.',
  applicationName: company.nameAr,
  openGraph: { type: 'website', locale: 'ar_SA', siteName: company.nameAr, images: [{ url: asset('/img/showroom-hall.webp'), width: 1600, height: 1068 }] },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: company.nameAr,
  alternateName: company.nameEn,
  foundingDate: String(company.founded),
  url: SITE_URL + '/',
  logo: SITE_URL + '/img/logo.png',
  image: SITE_URL + '/img/showroom-hall.webp',
  email: company.email,
  telephone: '+966' + company.phones.primary.slice(1),
  address: { '@type': 'PostalAddress', streetAddress: 'شارع أبو عبيدة بن الجراح، حي السعادة', addressLocality: 'الرياض', addressCountry: 'SA' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:00', closes: '17:00' }],
  areaServed: 'SA',
  sameAs: company.social.map((s) => s.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2">تخطَّ إلى المحتوى</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ContactFab />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </body>
    </html>
  );
}
