import { NextRequest, NextResponse } from 'next/server'
import { waitlistService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check for password in headers
    const password = request.headers.get('x-admin-password')
    const expectedPassword = process.env.ADMIN_PASSWORD
    
    // Ensure password is configured
    if (!expectedPassword) {
      console.error('ADMIN_PASSWORD environment variable not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Unauthorized access fuck off-you dumbass 🖕🖕🖕' },
        { status: 401 }
      )
    }

    // Get real data from Supabase
    const allUsers = await waitlistService.getAllUsers()
    const totalCount = await waitlistService.getUserCount()

    return NextResponse.json({
      success: true,
      data: allUsers,
      count: totalCount,
      message: 'Real waitlist data from Supabase'
    })
    
  } catch (error) {
    console.error('Admin waitlist fetch error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to fetch waitlist data' },
      { status: 500 }
    )
  }
}
