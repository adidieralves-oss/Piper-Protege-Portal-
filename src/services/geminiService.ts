import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const askPiperIA = async (prompt: string, context: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemInstruction = `Você é o Piper IA, assistente inteligente de vendas e atendimento da empresa Piper Protege.
Você ajuda colaboradores com estratégias de vendas, abordagem de clientes, scripts e análise de carteira.
Seja direto, prático e motivador. Use emojis moderadamente. Responda em português.

Contexto do portal:
${context}`;

    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Não consegui conectar com o Piper IA. Verifique sua conexão e tente novamente.");
  }
};
