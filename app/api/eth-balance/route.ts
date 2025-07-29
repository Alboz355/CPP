import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;

    if (!infuraKey) {
      console.error('⚠️ NEXT_PUBLIC_INFURA_KEY not found in environment variables');
      return NextResponse.json({ error: 'Infura API key not configured' }, { status: 500 });
    }

    const infuraUrl = `https://mainnet.infura.io/v3/${infuraKey}`;

    console.log(`⚡ Proxy: Appel Ethereum via Infura`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(infuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CryptoPayPro/1.0'
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Infura API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Proxy: Appel Ethereum réussi`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error calling Ethereum API:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Unable to call Ethereum API',
        details: error.message,
        result: '0x0'
      }, 
      { status: 500 }
    );
  }
}