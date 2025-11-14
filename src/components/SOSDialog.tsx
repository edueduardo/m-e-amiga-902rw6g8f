import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AudioPlayer } from './AudioPlayer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HeartPulse, Wind, MessagesSquare, Music } from 'lucide-react'

interface SOSDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const comfortingMessages = [
  'Respire fundo. Este momento vai passar.',
  'Você é mais forte do que pensa. Você já superou tantos desafios.',
  'Permita-se sentir. Suas emoções são válidas.',
  'Está tudo bem não estar bem. Seja gentil consigo mesma.',
  'Você não está sozinha. Muitas de nós sentimos o mesmo.',
  'Foque no agora. Um passo de cada vez.',
]

export const SOSDialog = ({ open, onOpenChange }: SOSDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartPulse className="text-primary" />
            SOS - Alívio Imediato
          </DialogTitle>
          <DialogDescription>
            Use estes recursos para encontrar um pouco de calma agora.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="respiracao" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="respiracao">
              <Wind className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="meditacao">
              <HeartPulse className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="mensagens">
              <MessagesSquare className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="musicas">
              <Music className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="respiracao" className="mt-4">
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Respiração Quadrada</h3>
              <p className="text-muted-foreground">
                Siga o guia para acalmar seu sistema nervoso.
              </p>
              <div className="p-4 border rounded-lg">
                <p className="text-lg mb-2">1. Inspire por 4 segundos.</p>
                <p className="text-lg mb-2">2. Segure o ar por 4 segundos.</p>
                <p className="text-lg mb-2">3. Expire por 4 segundos.</p>
                <p className="text-lg">4. Segure sem ar por 4 segundos.</p>
              </div>
              <p>Repita o ciclo por 1 a 3 minutos.</p>
            </div>
          </TabsContent>
          <TabsContent value="meditacao" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-center">
                Meditação Guiada (3 min)
              </h3>
              <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" />
              <p className="text-sm text-muted-foreground text-center">
                Feche os olhos e permita-se ser guiada.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="mensagens" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {comfortingMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="p-3 bg-secondary rounded-lg text-secondary-foreground"
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="musicas" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-center">Músicas Calmas</h3>
              <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" />
              <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
