import { NextResponse } from 'next/server'
import { getProducts } from '@/app/actions/finance'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trm = searchParams.get('trm') || '0'

  try {
    const data = await getProducts('saving', trm)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error (Savings):', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
