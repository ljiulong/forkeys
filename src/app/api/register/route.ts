import { NextRequest, NextResponse } from 'next/server'

// This is a simple implementation that stores data in-memory
// In production, you should use a database
const users = new Map<string, { question: string; answer: string }>()

export async function POST(request: NextRequest) {
  try {
    const { email, question, answer } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Store user data
    users.set(email, { question, answer })

    // In production, you would send an actual email here
    console.log(`User registered: ${email}`)

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
