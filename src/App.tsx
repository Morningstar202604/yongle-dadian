import { Hero } from '@/components/hero/Hero';
import { Preface } from '@/components/preface/Preface';
import { Catalog } from '@/components/catalog/Catalog';
import { Chronology } from '@/components/chronology/Chronology';
import { Voyage } from '@/components/voyage/Voyage';
import { Footer } from '@/components/footer/Footer';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { ReadingProvider } from '@/features/reading/ReadingProvider';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const SECTIONS = ['intro', 'catalog', 'chron', 'voyage'] as const;

export default function App() {
  const activeSection = useScrollSpy(SECTIONS);
  const progress = useScrollProgress();

  return (
    <ReadingProvider>
      <SiteHeader activeSection={activeSection} progress={progress} />
      <main>
        <Hero />
        <Preface />
        <Catalog />
        <Chronology />
        <Voyage />
      </main>
      <Footer />
    </ReadingProvider>
  );
}
