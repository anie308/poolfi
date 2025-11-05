import { NextRequest, NextResponse } from 'next/server'
import { waitlistService } from '@/lib/supabase'
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, country } = body

    // Basic validation
    if (!name || !email || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if email already exists
    const existingUser = await waitlistService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Add to database
    const newUser = await waitlistService.addUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      country,
      ipAddress: ip,
      userAgent: userAgent,
    })

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(email, name).catch(error => 
      console.error('Failed to send welcome email:', error)
    )

    // Send admin notification (async, don't wait for it)
    sendAdminNotification({ name, email, country }).catch(error => 
      console.error('Failed to send admin notification:', error)
    )

    // Get total count for response
    const totalCount = await waitlistService.getUserCount()

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          country: newUser.country
        },
        totalCount
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const users = await waitlistService.getAllUsers()
    const totalCount = await waitlistService.getUserCount()

    return NextResponse.json({
      total: totalCount,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        createdAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Failed to fetch waitlist data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist data' },
      { status: 500 }
    )
  }
}

