import { NextResponse } from 'next/server';
import { runAiJob } from '@ai/ai_router';

export async function POST(req: Request) {
  try {
    const { mode } = await req.json();
    let input = '';
    
    switch (mode) {
      case 'inference':
        input = 'infer: hello world';
        break;
      case 'embedding':
        input = 'embed: hello world this is a test';
        break;
      case 'generation':
        input = 'gen: hello world';
        break;
      default:
        return NextResponse.json({ ok: false, error: 'Invalid mode' }, { status: 400 });
    }

    const job = {
      id: `dashboard-test-${Date.now()}`,
      type: 'score',
      payload: { input }
    };

    const result = await runAiJob(job);
    
    if (result.status !== 'ok') {
      return NextResponse.json({ ok: false, error: result.error });
    }

    const data = result.data;
    
    if (mode === 'inference') {
      return NextResponse.json({
        ok: true,
        type: 'inference',
        outputShape: data.inference.outputShape,
        outputPreview: data.inference.outputPreview
      });
    } else if (mode === 'embedding') {
      return NextResponse.json({
        ok: true,
        type: 'embedding',
        dims: data.embedding.dims,
        preview: data.embedding.embedding.slice(0, 10)
      });
    } else if (mode === 'generation') {
      return NextResponse.json({
        ok: true,
        type: 'generation',
        completion: data.completion.completion,
        tokensPreview: data.completion.tokens.slice(0, 10)
      });
    }

    return NextResponse.json({ ok: false, error: 'Inconsistent state' });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
