import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { ServicesSection } from "@/components/site/services-section";
import { BenefitsSection } from "@/components/site/benefits-section";
import { GallerySection } from "@/components/site/gallery-section";
import { PromosSection } from "@/components/site/promos-section";
import { LocationSection } from "@/components/site/location-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { Footer } from "@/components/site/footer";
import { WhatsappFloatButton } from "@/components/site/whatsapp-float-button";

// Services are read from the database on every request instead of being
// prerendered at build time — on Railway the SQLite volume isn't mounted
// during the build step, only at runtime.
export const dynamic = "force-dynamic";

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesSection services={services} />
        <BenefitsSection />
        <GallerySection />
        <PromosSection />
        <LocationSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <WhatsappFloatButton />
    </>
  );
}
