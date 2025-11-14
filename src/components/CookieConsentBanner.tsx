import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCookieConsent } from '@/hooks/useCookieConsent'
import { Cookie } from 'lucide-react'

export const CookieConsentBanner = () => {
  const { consent, acceptConsent, declineConsent } = useCookieConsent()

  if (consent) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
      <Card className="max-w-4xl mx-auto shadow-lg bg-background/90 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Cookie className="h-10 w-10 text-primary flex-shrink-0" />
          <div className="flex-grow text-center md:text-left">
            <p className="font-semibold">Nós usamos cookies</p>
            <p className="text-sm text-muted-foreground">
              Este site usa cookies para garantir que você obtenha a melhor
              experiência. Ao continuar, você concorda com o nosso uso de
              cookies. Leia nossa{' '}
              <Link
                to="/cookie-policy"
                className="underline hover:text-primary"
              >
                Política de Cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Button variant="outline" onClick={declineConsent}>
              Recusar Todos
            </Button>
            <Button onClick={acceptConsent}>Aceitar Todos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
