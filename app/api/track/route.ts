import { NextRequest, NextResponse } from 'next/server';
import { incrementFeatureClick } from '@/lib/db';

export const runtime = 'nodejs';

const VALID_FEATURES = [
  'chart', 'heming', 'daily', 'cezi', 'chouqian', 'tongqian',
  'mianxiang', 'shouxiang', 'fengshui', 'library', 'knowledge',
  'recitation', 'vegetarian', 'meditation', 'reflection', 'taichi', 'charity',
  'prayer', 'wish', 'repent', 'lamp', 'incense', 'ritual',
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { feature } = body;

  if (!feature || !VALID_FEATURES.includes(feature)) {
    return NextResponse.json({ error: 'invalid_feature' }, { status: 400 });
  }

  incrementFeatureClick(feature);
  return NextResponse.json({ success: true });
}