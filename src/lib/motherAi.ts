const API_URL = 'https://api.openai.com/v1'
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

interface EmotionalProfile {
  primaryEmotion: string
  secondaryEmotions: string[]
  intensity: 'baixa' | 'média' | 'alta'
  underlyingNeeds: string[]
  keyConcerns: string[]
}

interface PracticalAdvice {
  advice: string[]
}

export interface MotherReplyPayload {
  reply: string
  mood_label: string
}

/**
 * Transcribes an audio file using the OpenAI Whisper API.
 * @param audioFile The audio file to transcribe.
 * @returns The transcribed text as a string.
 */
export const transcribeAudio = async (audioFile: File): Promise<string> => {
  if (!API_KEY) {
    console.error('OpenAI API key is missing.')
    return 'Erro: Chave da API não configurada.'
  }

  const formData = new FormData()
  formData.append('file', audioFile)
  formData.append('model', 'whisper-1')

  try {
    const response = await fetch(`${API_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (response.ok) {
      return data.text
    } else {
      throw new Error(data.error?.message || 'Failed to transcribe audio.')
    }
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return 'Desculpe, não consegui entender o áudio. Tente novamente.'
  }
}

const performEmotionalAnalysis = async (
  transcript: string,
): Promise<EmotionalProfile | null> => {
  const prompt = `Você é uma IA especialista em psicologia. Analise o texto a seguir e identifique o perfil emocional. Responda APENAS com um objeto JSON com a seguinte estrutura: { "primaryEmotion": "string", "secondaryEmotions": ["string"], "intensity": "baixa" | "média" | "alta", "underlyingNeeds": ["string"], "keyConcerns": ["string"] }. Emoções válidas: triste, cansada, ansiosa, irritada, feliz, neutra. Texto: "${transcript}"`
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    })
    const data = await response.json()
    return JSON.parse(data.choices[0]?.message?.content)
  } catch (error) {
    console.error('Error in emotional analysis:', error)
    return null
  }
}

const generatePracticalAdvice = async (
  profile: EmotionalProfile,
): Promise<PracticalAdvice | null> => {
  const prompt = `Você é uma IA coach de bem-estar. Baseado no perfil emocional a seguir, gere 2-3 conselhos práticos, simples e acionáveis. Responda APENAS com um objeto JSON com a estrutura: { "advice": ["string", "string"] }. Perfil: ${JSON.stringify(
    profile,
  )}`
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        response_format: { type: 'json_object' },
      }),
    })
    const data = await response.json()
    return JSON.parse(data.choices[0]?.message?.content)
  } catch (error) {
    console.error('Error generating advice:', error)
    return null
  }
}

export const generateMotherReply = async (
  transcript: string,
): Promise<MotherReplyPayload> => {
  const fallbackReply = {
    reply:
      'Minha filha, tive um probleminha para processar sua mensagem, mas saiba que estou aqui com você em pensamento. Tente me contar de novo daqui a pouquinho.',
    mood_label: 'neutra',
  }
  if (!API_KEY) return fallbackReply

  const emotionalProfile = await performEmotionalAnalysis(transcript)
  if (!emotionalProfile) return fallbackReply

  const practicalAdvice = await generatePracticalAdvice(emotionalProfile)
  if (!practicalAdvice) return fallbackReply

  const systemPrompt = `Você é 'Mãe Amiga', uma IA coach para mulheres casadas sobrecarregadas. Seu tom é de uma mãe experiente, amorosa e melhor amiga. Você oferece conselhos de vida práticos e carinhosos. Você NÃO PODE dar conselhos médicos ou diagnósticos. Seu objetivo é fazer a usuária se sentir ouvida, compreendida e apoiada. Sua língua é o português do Brasil.`
  const userPrompt = `O desabafo da minha filha foi: "${transcript}". Minha análise interna (não mostre a ela) indica este perfil emocional: ${JSON.stringify(
    emotionalProfile,
  )}, e estas são algumas sugestões práticas: ${JSON.stringify(
    practicalAdvice.advice,
  )}. Agora, escreva uma resposta única e coesa para ela. Comece validando os sentimentos dela. Depois, com muito carinho, integre as sugestões práticas de forma natural na sua fala. Termine com uma mensagem de apoio e amor incondicional. Seja calorosa e encorajadora.`

  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })
    const data = await response.json()
    return {
      reply: data.choices[0]?.message?.content,
      mood_label: emotionalProfile.primaryEmotion || 'neutra',
    }
  } catch (error) {
    console.error('Error generating final reply:', error)
    return fallbackReply
  }
}

/**
 * Creates a compassionate weekly summary based on mood percentages.
 * @param moodStats A record of mood counts for the week.
 * @returns A summary string in a caring tone.
 */
export const generateWeeklyMotherSummary = async (
  moodStats: Record<string, number>,
): Promise<string> => {
  if (!API_KEY)
    return 'Filha, olhando para a sua semana, vejo sua jornada e seu esforço. Continue se cuidando. Com amor, Mãe Amiga.'

  const systemPrompt = `You are 'Mãe Amiga', an AI coach. Your tone is loving and supportive. You are writing a weekly summary for a user based on their mood logs. You MUST NOT provide medical advice. Your language is Brazilian Portuguese.`
  const userPrompt = `Here are my mood stats for the week: ${JSON.stringify(
    moodStats,
  )}. Please write a short, compassionate summary of my week, highlighting the dominant mood and offering gentle encouragement.`

  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })
    const data = await response.json()
    return data.choices[0]?.message?.content
  } catch (error) {
    console.error('Error generating summary:', error)
    return 'Filha, não consegui gerar seu resumo desta semana, mas quero que saiba que acompanhei sua jornada e estou orgulhosa de você. Continue se cuidando.'
  }
}
