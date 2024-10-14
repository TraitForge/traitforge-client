//import { NextRequest, NextResponse } from 'next/server';
//import { processImage } from '~/utils/entropy';

//export const POST = async (req: NextRequest) => {
//  const data = await req.json();
//  const { paddedEntropy, entityGeneration, isPossiblyInbred } = data;
//
//  try {
//    const url = await processImage(
//      paddedEntropy as string,
//      paddedEntropy as string,
//      entityGeneration as string,
//      isPossiblyInbred as boolean
//    );
//    return NextResponse.json({ url }, { status: 200 });
//  } catch (error) {
//    console.error('Failed to generate or upload:', error);
//    return NextResponse.json(
//      { error: 'Failed to compose or upload image' },
//      { status: 500 }
//    );
//  }
//};
