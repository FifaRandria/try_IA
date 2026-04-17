import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { topic, level, name } = body

    if (!topic || !level || !name) {
      return Response.json({ error: 'Missing required fields: topic, level, name' }, { status: 400 })
    }

    const prompts = {
      enfant: `Explique ${topic} comme à un enfant de 5 ans avec des exemples simples, prend une exemple concret.`,
      debutant: `Explique ${topic} simplement pour un débutant, prend une exemple concret`,
      avance: `Explique ${topic} avec plus de détails techniques, prend une exemple concret`
    }

    if (!prompts[level]) {
      return Response.json({ error: 'Invalid level. Must be: enfant, debutant, or intermediaire' }, { status: 400 })
    }

    const models = [
      "mistralai/mistral-7b-instruct",
      "qwen/qwen-2.5-7b-instruct",
      "meta-llama/llama-3.1-8b-instruct"
    ]

    let aiRes = null

    for (const model of models) {
      aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompts[level]
            }
          ]
        })
      })

      if (aiRes.ok) break

      console.warn(`Model ${model} failed:`, aiRes.status)
    }

    if (!aiRes.ok) {
      const errorData = await aiRes.json().catch(() => ({}))
      console.error('OpenRouter API error:', aiRes.status, errorData)
      return Response.json({ error: `AI API error: ${aiRes.status}` }, { status: 502 })
    }

    const data = await aiRes.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in AI response:', data)
      return Response.json({ error: 'No content received from AI' }, { status: 502 })
    }

    // 💾 Sauvegarde DB
    const saved = await prisma.explanation.create({
      data: {
        topic,
        level,
        content
      }
    })

    return Response.json(saved)
  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}