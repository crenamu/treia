// AI 큐레이션 + 시장 분석용
export async function askGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      })
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// AI 이미지 분석용 (Vision)
export async function askGeminiVision(prompt: string, base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 }
      })
    }
  );
  
  const data = await res.json();
  if (data.error) {
    console.error("Gemini Vision Error:", data.error);
    throw new Error(data.error.message || "Vision API Failed");
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// 트레이딩 아티클 한국어 요약
export async function summarizeArticle(title: string, content: string) {
  const prompt = `
다음 트레이딩 아티클을 한국어로 요약해줘.

제목: ${title}
내용: ${content}

다음 JSON 형식으로만 답해줘:
{
  "title_ko": "한국어 제목",
  "summary_ko": "3줄 핵심 요약",
  "category": "자동매매|인디케이터|매매기법|리스크관리|입문",
  "difficulty": "입문|중급|고급"
}
`
  const result = await askGemini(prompt)
  try {
    return JSON.parse(result.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}
