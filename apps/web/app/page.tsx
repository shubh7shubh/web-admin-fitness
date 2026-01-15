import { Header, Footer } from '@/components/marketing';
import {
  SecretHeroSection,
  IndustryLiesSection,
  SecretRevealSection,
  TransformationProofSection,
  SystemOverviewSection,
  FinalConversionSection,
} from '@/components/marketing/secrets';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SecretHeroSection />
        <IndustryLiesSection />
        <SecretRevealSection />
        <TransformationProofSection />
        <SystemOverviewSection />
        <FinalConversionSection />
      </main>
      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "ApexOne",
            applicationCategory: "HealthApplication",
            operatingSystem: "Android, iOS",
            description: "Gamified fitness tracking app with calorie counting, macro tracking, social challenges, and leaderboards.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "10000",
            },
          }),
        }}
      />
    </>
  );
}
