import { HeroSection } from '@/components/landing/HeroSection'
import { PainPointsSection } from '@/components/landing/PainPointsSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { EthicalNoticeSection } from '@/components/landing/EthicalNoticeSection'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

const SupportCircleCTA = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
    <div className="container px-4 md:px-6 text-center">
      <Users className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
        Junte-se ao nosso Círculo de Apoio
      </h2>
      <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
        Um espaço seguro e anônimo para compartilhar experiências e encontrar
        apoio em outras mulheres que entendem o que você está passando.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link to="/app/support-circle">Entrar no Círculo</Link>
      </Button>
    </div>
  </section>
)

const Index = () => {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SupportCircleCTA />
      <TestimonialsSection />
      <PricingSection />
      <EthicalNoticeSection />
    </>
  )
}

export default Index
