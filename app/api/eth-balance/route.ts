import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Try to get the key from environment
    const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;

    if (!infuraKey) {
      console.error('⚠️ NEXT_PUBLIC_INFURA_KEY not found in environment variables');
      // Return a fallback response instead of error
      return NextResponse.json({
        jsonrpc: "2.0",
        result: "0x0",
        id: body.id || 1
      });
    }

    const infuraUrl = `https://mainnet.infura.io/v3/${infuraKey}`;

    console.log(`⚡ Proxy: Appel Ethereum via Infura`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

    try {
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.log(`⚠️ Erreur réseau Infura:`, fetchError);
      
      // Return fallback instead of error
      return NextResponse.json({
        jsonrpc: "2.0",
        result: "0x0", // Return 0 balance as fallback
        id: body.id || 1
      });
    }
  } catch (error: any) {
    console.error('Error in eth-balance route:', error.message);
    
    return NextResponse.json(
      { 
        jsonrpc: "2.0",
        result: "0x0",
        id: 1
      }
    );
  }
}