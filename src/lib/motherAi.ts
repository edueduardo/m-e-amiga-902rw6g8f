const API_URL = 'https://api.openai.com/v1'
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

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

/**
 * Analyzes the mood from a text using the OpenAI Chat Completions API.
 * @param transcript The user's text entry.
 * @returns A mood label string.
 */
export const analyzeMoodFromText = async (
  transcript: string,
): Promise<string> => {
  if (!API_KEY) return 'neutra'

  const prompt = `Analyze the following text and classify the user's primary mood into one of these categories: triste, cansada, ansiosa, irritada, feliz, neutra. Respond with only the category name in lowercase. Text: "${transcript}"`

  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 10,
      }),
    })
    const data = await response.json()
    const mood = data.choices[0]?.message?.content.trim().toLowerCase()
    const validMoods = [
      'triste',
      'cansada',
      'ansiosa',
      'irritada',
      'feliz',
      'neutra',
    ]
    return validMoods.includes(mood) ? mood : 'neutra'
  } catch (error) {
    console.error('Error analyzing mood:', error)
    return 'neutra'
  }
}

/**
 * Generates a caring, practical response using the OpenAI Chat Completions API.
 * @param transcript The user's text entry.
 * @param mood The detected mood.
 * @returns A compassionate response string.
 */
export const generateMotherReply = async (
  transcript: string,
  mood: string,
): Promise<string> => {
  if (!API_KEY)
    return 'Oi, filha. Obrigada por compartilhar isso comigo. Estou sempre aqui para te ouvir.'

  const systemPrompt = `You are 'Mãe Amiga', an AI coach for overwhelmed married women. Your tone is that of an experienced, loving mother and a supportive best friend. You provide caring, practical life advice. You MUST NOT provide medical or diagnostic advice or act as a therapist. Your goal is to make the user feel heard, understood, and supported. Your language is Brazilian Portuguese.`
  const userPrompt = `My mood is: ${mood}. My thoughts are: "${transcript}". Please give me a compassionate and encouraging response.`

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
        max_tokens: 250,
      }),
    })
    const data = await response.json()
    return data.choices[0]?.message?.content
  } catch (error) {
    console.error('Error generating reply:', error)
    return 'Minha filha, tive um probleminha para processar sua mensagem, mas saiba que estou aqui com você em pensamento. Tente me contar de novo daqui a pouquinho.'
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
