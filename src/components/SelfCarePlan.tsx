import { useState } from 'react'
import { SelfCarePlan as SelfCarePlanType } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, MessageSquareQuote } from 'lucide-react'

interface SelfCarePlanProps {
  plan: SelfCarePlanType
  onRefine: (feedback: string) => void
  onAccept: () => void
}

const toneMap: Record<SelfCarePlanType['tone'], string> = {
  amoras: 'Tom: Amoroso',
  'reais duros': 'Tom: Realista',
  impactantes: 'Tom: Impactante',
}

export const SelfCarePlan = ({
  plan,
  onRefine,
  onAccept,
}: SelfCarePlanProps) => {
  const [isRefining, setIsRefining] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleReject = () => {
    setIsRefining(true)
  }

  const handleConfront = () => {
    if (feedback.trim()) {
      onRefine(feedback)
      setIsRefining(false)
      setFeedback('')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Sua Trilha de Autocuidado</h2>
        <p className="text-muted-foreground">
          Uma sugestão de caminho, com carinho, para você.
        </p>
        <Badge variant="secondary" className="mt-2">
          {toneMap[plan.tone]}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foco Diário</CardTitle>
            <CardDescription>{plan.dailyFocus.title}</CardDescription>
          </CardHeader>
          <CardContent>{plan.dailyFocus.description}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foco Semanal</CardTitle>
            <CardDescription>{plan.weeklyFocus.title}</CardDescription>
          </CardHeader>
          <CardContent>{plan.weeklyFocus.description}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foco Mensal</CardTitle>
            <CardDescription>{plan.monthlyFocus.title}</CardDescription>
          </CardHeader>
          <CardContent>{plan.monthlyFocus.description}</CardContent>
        </Card>
      </div>

      {isRefining ? (
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle>O que podemos ajustar?</CardTitle>
            <CardDescription>
              Sua opinião é o mais importante. Digite sua versão mais detalhada
              ou o que você gostaria de mudar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ex: 'Gostaria de algo mais prático para o dia a dia' ou 'Isso não parece ser para mim agora porque...'"
              rows={4}
            />
          </CardContent>
          <CardContent className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsRefining(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfront}>
              <MessageSquareQuote className="mr-2 h-4 w-4" />
              Confrontar a inteligência artificial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={handleReject}>
            <ThumbsDown className="mr-2 h-4 w-4" />
            Não aceitar a resposta
          </Button>
          <Button onClick={onAccept}>
            <ThumbsUp className="mr-2 h-4 w-4" />É isso que eu preciso
          </Button>
        </div>
      )}
    </div>
  )
}
