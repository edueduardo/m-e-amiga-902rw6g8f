import { HeroSection } from '@/components/landing/HeroSection'
import { PainPointsSection } from '@/components/landing/PainPointsSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { CoreFeaturesSection } from '@/components/landing/CoreFeaturesSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { EthicalNoticeSection } from '@/components/landing/EthicalNoticeSection'
import { HooponoponoDesireSection } from '@/components/landing/HooponoponoDesireSection'

const Index = () => {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <HowItWorksSection />
      <CoreFeaturesSection />
      <HooponoponoDesireSection />
      <TestimonialsSection />
      <PricingSection />
      <EthicalNoticeSection />
    </>
  )
}

export default Index
