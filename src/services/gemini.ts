import { GoogleGenAI } from "@google/genai";

const GEMINI_KEY = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
const ai = (GEMINI_KEY && GEMINI_KEY !== "undefined" && GEMINI_KEY !== "null") 
  ? new GoogleGenAI({ apiKey: GEMINI_KEY }) 
  : null;

const SYSTEM_PROMPT = `
أنت خبير تسويق متخصص في السوق المصري.
مهمتك هي كتابة بوستات تسويقية جذابة جداً بالعامية المصرية فقط.
يجب أن يكون الأسلوب:
1. فكاهي أو عاطفي أو حماسي حسب نوع المنتج.
2. يستخدم كلمات دارجة ومحبوبة في الشارع المصري (زي: "يا بلاش"، "الحق العرض"، "شياكة"، "عظمة"، "فرصة ما تتعوضش").
3. يتضمن "Call to Action" واضح (زي: "ابعتلنا رسالة"، "كلمنا على رقم...").
4. يستخدم الإيموجي بشكل مناسب.
5. يركز على المميزات اللي بتهم المصريين (السعر، الجودة، الشياكة).

ممنوع استخدام اللغة العربية الفصحى تماماً.
ممنوع كتابة أي شيء غير البوست التسويقي.
`;

export async function generateMarketingPost(productName: string, productDescription?: string, imageBase64?: string) {
  if (!ai) {
    throw new Error("Gemini API Key is missing or invalid.");
  }
  let prompt = `اكتب بوست تسويقي لمنتج اسمه: ${productName}.`;
  if (productDescription) {
    prompt += ` وصف المنتج: ${productDescription}`;
  }

  const parts: any[] = [{ text: prompt }];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(",")[1] || imageBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
    }
  });

  return response.text || "عذراً، لم أستطع توليد البوست حالياً.";
}
