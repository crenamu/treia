import { NextResponse } from 'next/server'
import { getLoans, getLoanById } from '@/app/actions/loan'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const type = (searchParams.get('type') as 'mortgage' | 'rent' | 'credit') || 'credit'

  try {
    if (id) {
      const data = await getLoanById(id)
      return NextResponse.json(data)
    }
    
    const data = await getLoans(type)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
