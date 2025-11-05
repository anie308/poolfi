'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Contribution from '@/components/landing/Contribution'
import WhyPoolFi from '@/components/landing/WhyPoolFi'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    console.log('Get Started button clicked!')
    router.push('/app')
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f7f9fc' }}>
      <Navbar onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      <Contribution />
      <WhyPoolFi onGetStarted={handleGetStarted} />
      <CTA onGetStarted={handleGetStarted} />
      <Footer />
    </main>
  )
}