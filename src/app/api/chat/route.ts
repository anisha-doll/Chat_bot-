import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY missing in .env.local' },
        { status: 500 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'openai/gpt-oss-20b',
    });

    const reply = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('Groq API Error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}