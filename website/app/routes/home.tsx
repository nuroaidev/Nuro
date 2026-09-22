import type { Route } from "./+types/home";
import { SiteFooter, SiteHeader } from "../components/layout/site-chrome";
import { HeroSection } from "../components/sections/hero-section";
import { PrivateInferenceSection } from "../components/sections/private-inference-section";
import { PublicVsPrivateSection } from "../components/sections/public-vs-private-section";
import { ProductsSection } from "../components/sections/products-section";
import { NuroTokenSection } from "../components/sections/nuro-token-section";
import { FaqSection } from "../components/sections/faq-section";
import { StippleField } from "../components/brand/stipple-field";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuro AI - Private Inference, Actually Proven" },
    {
      name: "description",
      content:
        "Sharded inference solved size, not privacy. Nuro quantifies prompt recoverability and closes the gap - decentralized, uncensored, on contributed GPUs.",
    },
    { property: "og:url", content: "https://nuroai.xyz" },
    { property: "og:title", content: "Nuro AI" },
    {
      property: "og:description",
      content:
        "Private inference, actually proven - on GPUs people contribute, not rent.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />
      <main>
        <HeroSection />
        <PrivateInferenceSection />
        <PublicVsPrivateSection />
        <ProductsSection />
        <NuroTokenSection />
        <div className="faq-close relative overflow-hidden">
          <StippleField seed={0xe1d0c009} />
          <div className="relative z-[1]">
            <FaqSection />
            <SiteFooter flush />
          </div>
        </div>
      </main>
    </div>
  );
}
