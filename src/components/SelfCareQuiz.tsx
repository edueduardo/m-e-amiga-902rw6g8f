import { useState } from 'react'
import { QuizQuestion } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

interface SelfCareQuizProps {
  questions: QuizQuestion[]
  onSubmit: (answers: Record<string, string>) => void
}

export const SelfCareQuiz = ({ questions, onSubmit }: SelfCareQuizProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(answers)
  }

  const isFormComplete = questions.every((q) => answers[q.id])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Um momento para você
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <Label className="text-lg">{q.question}</Label>
              {q.type === 'multiple-choice' && q.options && (
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                  className="space-y-2"
                >
                  {q.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                      <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {q.type === 'text' && (
                <Textarea
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Sinta-se à vontade para escrever..."
                />
              )}
            </div>
          ))}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!isFormComplete}
          >
            Ver minha trilha de cuidado
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
