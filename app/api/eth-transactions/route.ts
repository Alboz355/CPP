import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    console.log(`⚡ Proxy: Récupération des transactions ETH pour ${address}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=1&offset=5`,
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
      throw new Error(`Etherscan API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Proxy: Transactions ETH récupérées avec succès`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching ETH transactions:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Unable to fetch ETH transactions',
        details: error.message,
        status: '0',
        result: []
      }, 
      { status: 500 }
    );
  }
}