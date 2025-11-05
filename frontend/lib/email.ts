// Email service using Resend (recommended) or other providers

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Resend configuration
export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY!,
  from: process.env.EMAIL_FROM || 'noreply@poolfi.com',
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to PoolFi Waitlist! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to PoolFi!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining the PoolFi waitlist! We're excited to have you on board.</p>
        <p>We'll notify you as soon as we launch and you can start pooling your crypto investments with friends.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's next?</h3>
          <ul>
            <li>We'll send you updates on our progress</li>
            <li>You'll get early access when we launch</li>
            <li>Special perks for early supporters</li>
          </ul>
        </div>
        <p>Best regards,<br>The PoolFi Team</p>
      </div>
    `,
    text: `Welcome to PoolFi! Hi ${name}, thank you for joining our waitlist. We'll notify you when we launch!`
  }),

  adminNotification: (userData: { name: string; email: string; country: string }) => ({
    subject: 'New Waitlist Signup - PoolFi',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Waitlist Signup</h2>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Country:</strong> ${userData.country}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
    text: `New signup: ${userData.name} (${userData.email}) from ${userData.country}`
  })
}

// Send email using Resend
export async function sendEmail(emailData: EmailData) {
  if (!emailConfig.apiKey) {
    console.warn('Email API key not configured, skipping email send')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailConfig.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send welcome email to user
export async function sendWelcomeEmail(email: string, name: string) {
  const template = emailTemplates.welcome(name)
  return await sendEmail({
    to: email,
    ...template
  })
}

// Send notification to admin
export async function sendAdminNotification(userData: { name: string; email: string; country: string }) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.warn('Admin email not configured')
    return { success: false, error: 'Admin email not configured' }
  }

  const template = emailTemplates.adminNotification(userData)
  return await sendEmail({
    to: adminEmail,
    ...template
  })
}
