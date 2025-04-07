import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

interface OpenAIError extends Error {
  status?: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let images;
    try {
      // Generate all 4 images at once with DALL-E 2
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 4,
        size: "1024x1024"
      });
      images = response.data;
    } catch (error) {
      const openAIError = error as OpenAIError;
      console.error('Error in image generation:', error);
      return NextResponse.json(
        { error: openAIError.message || 'Failed to generate images' },
        { status: openAIError.status || 500 }
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}
