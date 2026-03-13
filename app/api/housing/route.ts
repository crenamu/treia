import { NextResponse } from 'next/server'
import { getHousingNotices } from '@/app/actions/housing'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '100'
  const id = searchParams.get('id')
  
  try {
    const data = await getHousingNotices(page, pageSize, id || undefined)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error (Housing):', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
