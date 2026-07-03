// frontend/src/pages/Home.jsx
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import About from '../components/About.jsx';
import IndicatorCatalog from '../components/IndicatorCatalog.jsx';
import FAQ from '../components/FAQ.jsx';
import CTABanner from '../components/CTABanner.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <IndicatorCatalog />
        <FAQ />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
