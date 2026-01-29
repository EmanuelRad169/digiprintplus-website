import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');

  if (!secret || secretParam !== secret) {
    return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
  }

  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: 'Error revalidating', error: errorMessage }, { status: 500 });
  }
}