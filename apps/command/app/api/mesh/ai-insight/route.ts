import { NextResponse } from 'next/server';
import { runAiJob } from '@ai/ai_router';

export async function GET() {
  try {
    const job = {
      id: `ui-insight-${Date.now()}`,
      type: 'score',
      payload: {}
    };

    const result = await runAiJob(job);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[AI API Error]', err);
    return NextResponse.json({
      status: 'error',
      error: err.message
    }, { status: 500 });
  }
}
