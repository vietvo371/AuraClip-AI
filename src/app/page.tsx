import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

/**
 * Render the landing page composed of Header, Hero, Features, and Footer.
 *
 * @returns The page's JSX element: a container `div` (full viewport height) that includes `Header`, `Hero`, `Features`, and `Footer` in that order.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}