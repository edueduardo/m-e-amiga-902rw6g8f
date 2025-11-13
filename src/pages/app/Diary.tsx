import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mic, Send, Loader2, Square, Upload } from 'lucide-react'
import { voiceEntries } from '@/lib/data'
import { VoiceEntry } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  generateMotherReply,
  analyzeMoodFromText,
  transcribeAudio,
} from '@/lib/motherAi'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AudioPlayer } from '@/components/AudioPlayer'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const moodColors: { [key: string]: string } = {
  triste: 'bg-blue-100 text-blue-800',
  cansada: 'bg-purple-100 text-purple-800',
  ansiosa: 'bg-yellow-100 text-yellow-800',
  irritada: 'bg-red-100 text-red-800',
  feliz: 'bg-green-100 text-green-800',
  neutra: 'bg-gray-100 text-gray-800',
}

const DiaryPage = () => {
  const [entries, setEntries] = useState<VoiceEntry[]>(voiceEntries)
  const [newEntry, setNewEntry] = useState('')
  const [mood, setMood] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [reply, setReply] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)
      setStatus('Gravando... Fale com o coração.')
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        setAudioFile(
          new File([audioBlob], 'desabafo.webm', { type: 'audio/webm' }),
        )
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorderRef.current.start()
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setStatus('Não consegui acessar seu microfone.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setStatus('Gravação finalizada. Pronto para enviar.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setAudioURL(URL.createObjectURL(file))
      setStatus('Arquivo de áudio carregado.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry && !audioFile) return
    setIsLoading(true)
    setReply(null)

    let transcript = newEntry
    if (audioFile && !newEntry) {
      setStatus('Transcrevendo seu áudio...')
      transcript = await transcribeAudio(audioFile)
      setNewEntry(transcript)
    }

    if (!transcript) {
      setStatus('Não foi possível obter a transcrição.')
      setIsLoading(false)
      return
    }

    setStatus('Analisando seus sentimentos...')
    const detectedMood = mood || (await analyzeMoodFromText(transcript))
    setMood(detectedMood)

    setStatus('Preparando uma resposta com carinho...')
    const motherReply = await generateMotherReply(transcript, detectedMood)

    const entry: VoiceEntry = {
      id: new Date().toISOString(),
      created_at: new Date().toISOString(),
      transcript,
      mood_label: detectedMood as VoiceEntry['mood_label'],
      mother_reply: motherReply,
      audio_url: audioURL || undefined,
    }

    setReply(motherReply)
    setEntries([entry, ...entries])
    setNewEntry('')
    setMood('')
    setAudioFile(null)
    setAudioURL(null)
    setStatus('')
    setIsLoading(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Desabafo</CardTitle>
            <CardDescription>
              Grave um áudio, escreva, ou faça os dois. Estou aqui para te
              ouvir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Escreva aqui ou grave um áudio..."
                rows={4}
                disabled={isLoading}
              />
              {audioURL && <AudioPlayer src={audioURL} />}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={isRecording ? 'destructive' : 'outline'}
                  onClick={
                    isRecording ? handleStopRecording : handleStartRecording
                  }
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <Square className="mr-2 h-4 w-4" />
                  ) : (
                    <Mic className="mr-2 h-4 w-4" />
                  )}
                  {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="audio/*"
                  id="audio-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" /> Carregar Áudio
                </Button>
                <Select
                  value={mood}
                  onValueChange={setMood}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1 min-w-[180px]">
                    <SelectValue placeholder="Como você se sente?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="triste">Triste</SelectItem>
                    <SelectItem value="cansada">Cansada</SelectItem>
                    <SelectItem value="ansiosa">Ansiosa</SelectItem>
                    <SelectItem value="irritada">Irritada</SelectItem>
                    <SelectItem value="feliz">Feliz</SelectItem>
                    <SelectItem value="neutra">Neutra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (!newEntry && !audioFile)}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isLoading ? status : 'Enviar para Mãe Amiga'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {reply && (
          <Card className="bg-primary/10 border-primary animate-fade-in">
            <CardHeader>
              <CardTitle>Resposta da Mãe Amiga</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{reply}</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Seus Desabafos</CardTitle>
          <CardDescription>
            Relembre sua jornada e veja suas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {format(
                        new Date(entry.created_at),
                        "dd 'de' MMMM, yyyy",
                        { locale: ptBR },
                      )}
                    </p>
                    <Badge className={moodColors[entry.mood_label]}>
                      {entry.mood_label}
                    </Badge>
                  </div>
                  {entry.audio_url && <AudioPlayer src={entry.audio_url} />}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.transcript}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default DiaryPage
