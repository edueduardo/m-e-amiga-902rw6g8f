import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, HeartHandshake, CheckCircle } from 'lucide-react'
import {
  generateSelfCareQuiz,
  generateSelfCarePlan,
  refineSelfCarePlan,
} from '@/lib/motherAi'
import { QuizQuestion, SelfCarePlan } from '@/types'
import { SelfCareQuiz } from '@/components/SelfCareQuiz'
import { SelfCarePlan as SelfCarePlanComponent } from '@/components/SelfCarePlan'

type InteractionState =
  | 'idle'
  | 'loadingQuiz'
  | 'quiz'
  | 'generatingPlan'
  | 'plan'
  | 'refiningPlan'
  | 'accepted'

const CarePage = () => {
  const [state, setState] = useState<InteractionState>('idle')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [plan, setPlan] = useState<SelfCarePlan | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const startQuiz = async () => {
    setState('loadingQuiz')
    const questions = await generateSelfCareQuiz()
    setQuiz(questions)
    setState('quiz')
  }

  const handleQuizSubmit = async (submittedAnswers: Record<string, string>) => {
    setState('generatingPlan')
    setAnswers(submittedAnswers)
    const generatedPlan = await generateSelfCarePlan(submittedAnswers)
    setPlan(generatedPlan)
    setState('plan')
  }

  const handleRefinePlan = async (feedback: string) => {
    if (!plan) return
    setState('refiningPlan')
    const refinedPlan = await refineSelfCarePlan(plan, feedback, answers)
    setPlan(refinedPlan)
    setState('plan')
  }

  const handleAcceptPlan = () => {
    setState('accepted')
  }

  const renderContent = () => {
    switch (state) {
      case 'loadingQuiz':
      case 'generatingPlan':
      case 'refiningPlan':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <p className="text-muted-foreground">
              {state === 'loadingQuiz' && 'Preparando umas perguntas...'}
              {state === 'generatingPlan' &&
                'Criando uma trilha com carinho para você...'}
              {state === 'refiningPlan' && 'Ajustando o caminho...'}
            </p>
          </div>
        )
      case 'quiz':
        return <SelfCareQuiz questions={quiz} onSubmit={handleQuizSubmit} />
      case 'plan':
        return (
          plan && (
            <SelfCarePlanComponent
              plan={plan}
              onRefine={handleRefinePlan}
              onAccept={handleAcceptPlan}
            />
          )
        )
      case 'accepted':
        return (
          <div className="text-center space-y-4 max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">Ótima decisão, filha!</h2>
            <p className="text-muted-foreground">
              Sua trilha de autocuidado foi definida. Lembre-se de ser gentil
              consigo mesma nessa jornada. Um passo de cada vez.
            </p>
            <Button onClick={() => setState('idle')}>
              Começar uma nova trilha
            </Button>
          </div>
        )
      case 'idle':
      default:
        return (
          <div className="text-center space-y-4">
            <HeartHandshake className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Vamos cuidar de você hoje?</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Responda algumas perguntas rápidas e eu criarei uma trilha de
              autocuidado personalizada, só para você.
            </p>
            <Button size="lg" onClick={startQuiz}>
              Ver trilhas
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {renderContent()}
    </div>
  )
}

export default CarePage
