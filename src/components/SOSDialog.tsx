import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { HeartPulse, Sparkles } from 'lucide-react'
import {
  hooponoponoPractices,
  soothingSounds,
  getRandomHooponopono,
} from '@/lib/data'
import { HooponoponoPractice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { AidaTooltip } from './AidaTooltip'

interface SOSDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SOSDialog = ({ open, onOpenChange }: SOSDialogProps) => {
  const { preferences } = useUserPreferences()
  const [practice, setPractice] = useState<HooponoponoPractice | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (open) {
      const userPractice = hooponoponoPractices.find(
        (p) => p.id === preferences.sosPracticeId,
      )
      const userSound = soothingSounds.find(
        (s) => s.id === preferences.sosSoundId,
      )

      setPractice(userPractice || getRandomHooponopono())

      if (userSound) {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        audioRef.current = new Audio(userSound.url)
        audioRef.current.loop = true
        audioRef.current
          .play()
          .catch((e) => console.error('Audio play error:', e))
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [open, preferences])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartPulse className="text-primary" />
            SOS - Um Momento de Paz
          </DialogTitle>
          <DialogDescription>
            Respire fundo. Use este momento para encontrar um pouco de calma.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {practice && (
            <Card className="border-primary bg-primary/5 animate-fade-in">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {practice.title}
                </CardTitle>
                <AidaTooltip story={practice.aidaStory} />
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-2xl font-semibold italic text-primary">
                  "{practice.phrase}"
                </p>
                <p className="text-sm text-muted-foreground">
                  {practice.practice_tip}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
