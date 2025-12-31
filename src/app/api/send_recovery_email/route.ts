import { NextRequest, NextResponse } from 'next/server'

// This is a simple implementation that stores data in-memory
// In production, you should use a database
const users = new Map<string, { question: string; answer: string }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const userData = users.get(email)

    if (!userData) {
      return NextResponse.json({
        status: 'error',
        message: 'Email not found in database'
      }, { status: 404 })
    }

    // In production, you would send an actual email here with the recovery info
    console.log(`Recovery email sent to: ${email}`)
    console.log(`Question: ${userData.question}`)
    console.log(`Answer: ${userData.answer}`)

    return NextResponse.json({
      status: 'success',
      message: 'Recovery email sent'
    })
  } catch (error) {
    console.error('Recovery email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
