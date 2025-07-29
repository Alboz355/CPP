import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ 
        balance: 0,
        unconfirmed_balance: 0 
      });
    }

    console.log(`⚡ Proxy: Récupération du solde BTC pour ${address}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

    try {
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
        {
          headers: { 
            'Accept': 'application/json',
            'User-Agent': 'CryptoPayPro/1.0'
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`BlockCypher API error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log(`✅ Proxy: Solde BTC récupéré avec succès`);
      
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.log(`⚠️ Erreur réseau BlockCypher:`, fetchError);
      
      // Return fallback instead of error
      return NextResponse.json({
        balance: 0,
        unconfirmed_balance: 0,
        final_balance: 0
      });
    }
  } catch (error: any) {
    console.error('Error in btc-balance route:', error.message);
    
    return NextResponse.json({
      balance: 0,
      unconfirmed_balance: 0,
      final_balance: 0
    });
  }
}