import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const modelRelPath = 'ai/models/tiny-local-model.onnx';
  const modelAbsPath = path.join(process.cwd(), '../..', modelRelPath);
  const exists = fs.existsSync(modelAbsPath);

  return NextResponse.json({
    provider: "tiny-local",
    modelPath: modelRelPath,
    modelExists: exists,
    hasInference: true,
    hasEmbeddings: true,
    hasGeneration: true
  });
}
