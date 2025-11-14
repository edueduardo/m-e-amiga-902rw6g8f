import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, HeartHandshake, CheckCircle } from 'lucide-react'
import {
  generateSelfCareQuiz,
  generateSelfCarePlan,
  refineSelfCarePlan,
  SelfCareFocus,
} from '@/lib/motherAi'
import { QuizQuestion, SelfCarePlan as SelfCarePlanType } from '@/types'
import { SelfCarePlan } from '@/components/SelfCarePlan'
import { SelfCareQuizFlow } from '@/components/SelfCareQuizFlow'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type InteractionState =
  | 'focusSelection'
  | 'loadingQuiz'
  | 'quizFlow'
  | 'generatingPlan'
  | 'plan'
  | 'refiningPlan'
  | 'accepted'

const CarePage = () => {
  const [state, setState] = useState<InteractionState>('focusSelection')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [plan, setPlan] = useState<SelfCarePlanType | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [focus, setFocus] = useState<SelfCareFocus | null>(null)

  const startQuiz = async (selectedFocus: SelfCareFocus) => {
    setState('loadingQuiz')
    setFocus(selectedFocus)
    const questions = await generateSelfCareQuiz(selectedFocus)
    setQuiz(questions)
    setState('quizFlow')
  }

  const handleQuizSubmit = async (submittedAnswers: Record<string, string>) => {
    if (!focus) return
    setState('generatingPlan')
    setAnswers(submittedAnswers)
    const generatedPlan = await generateSelfCarePlan(submittedAnswers, focus)
    setPlan(generatedPlan)
    setState('plan')
  }

  const handleRefinePlan = async (feedback: string) => {
    if (!plan || !focus) return
    setState('refiningPlan')
    const refinedPlan = await refineSelfCarePlan(plan, feedback, answers, focus)
    setPlan(refinedPlan)
    setState('plan')
  }

  const handleAcceptPlan = () => {
    setState('accepted')
  }

  const resetFlow = () => {
    setState('focusSelection')
    setQuiz([])
    setPlan(null)
    setAnswers({})
    setFocus(null)
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
      case 'quizFlow':
        return (
          <SelfCareQuizFlow
            open={state === 'quizFlow'}
            onOpenChange={(open) => !open && resetFlow()}
            questions={quiz}
            onSubmit={handleQuizSubmit}
          />
        )
      case 'plan':
        return (
          plan && (
            <SelfCarePlan
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
            <Button onClick={resetFlow}>Começar uma nova trilha</Button>
          </div>
        )
      case 'focusSelection':
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto text-center">
            <CardHeader>
              <HeartHandshake className="h-16 w-16 mx-auto text-primary" />
              <CardTitle className="text-3xl font-bold">
                Vamos cuidar de você hoje?
              </CardTitle>
              <CardDescription className="max-w-xl mx-auto">
                Escolha um foco para a sua trilha de autocuidado. Com base na
                sua escolha, farei algumas perguntas para criar algo especial
                para você.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => startQuiz('daily')}
              >
                Foco na Rotina Diária
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => startQuiz('weekly')}
              >
                Foco na Semana
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => startQuiz('monthly')}
              >
                Foco no Mês
              </Button>
            </CardContent>
          </Card>
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
