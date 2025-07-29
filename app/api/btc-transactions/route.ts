import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    console.log(`⚡ Proxy: Récupération des transactions BTC pour ${address}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=5`,
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
    
    console.log(`✅ Proxy: Transactions BTC récupérées avec succès`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching BTC transactions:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Unable to fetch BTC transactions',
        details: error.message,
        txs: []
      }, 
      { status: 500 }
    );
  }
}