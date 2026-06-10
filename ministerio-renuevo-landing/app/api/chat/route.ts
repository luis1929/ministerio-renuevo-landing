import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    // Construir el prompt con historial de conversación
    const messages = [
      {
        role: 'system',
        content: 'Eres un asistente virtual del Ministerio El Renuevo. Responde de manera amable, profesional y concisa en español. Tu objetivo es ayudar a los visitantes con información sobre el ministerio.'
      },
      ...(history || []),
      { role: 'user', content: message }
    ];

    // Llamar a Ollama local
    const response = await fetch('http://157.137.218.136:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        prompt: message,
        stream: false,
        context: [] // Ollama maneja el contexto automáticamente
      }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con el modelo IA');
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response,
      success: true
    });

  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json(
      { 
        error: 'No se pudo procesar tu mensaje. Intenta de nuevo.',
        success: false
      },
      { status: 500 }
    );
  }
}