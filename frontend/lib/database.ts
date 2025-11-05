// Database configuration
// Using Prisma with PostgreSQL

export const databaseConfig = {
  provider: 'postgresql' as const,
  url: process.env.DATABASE_URL || 'postgres://user_69a97e85:3c7b1e9755495d739f6d5dc7bf81926d@db.pxxl.pro:49077/db_965c6ba5',
}

// Waitlist user interface (matches Prisma schema)
export interface WaitlistUser {
  id: string
  name: string
  email: string
  country?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
}

// Input type for creating waitlist users
export interface CreateWaitlistUser {
  name: string
  email: string
  country?: string
}

// Database operations interface
export interface DatabaseOperations {
  addUser(user: CreateWaitlistUser): Promise<WaitlistUser>
  getUserByEmail(email: string): Promise<WaitlistUser | null>
  getAllUsers(): Promise<WaitlistUser[]>
  getUserCount(): Promise<number>
}

