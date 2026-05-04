import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@univ-ndere.cm',
      to, subject, html,
    })
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export function otpEmailTemplate(name: string, otp: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#006633;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">Université de Ngaoundéré</h1>
        <p style="color:#CC9900;margin:5px 0 0;">Faculté des Sciences</p>
      </div>
      <div style="padding:30px;background:#f8f9fa;border:1px solid #e9ecef;">
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre code de vérification est :</p>
        <div style="text-align:center;margin:30px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#006633;">${otp}</span>
        </div>
        <p style="color:#666;font-size:14px;">Ce code expire dans 15 minutes.</p>
      </div>
    </div>`
}

export function statusChangeEmailTemplate(name: string, concours: string, statut: string, motif?: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#006633;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">Université de Ngaoundéré</h1>
      </div>
      <div style="padding:30px;background:#f8f9fa;border:1px solid #e9ecef;">
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Le statut de votre candidature au concours <strong>${concours}</strong> a été mis à jour :</p>
        <p style="font-size:18px;font-weight:bold;color:#2563eb;">${statut}</p>
        ${motif ? `<p><strong>Motif :</strong> ${motif}</p>` : ''}
        <p>Connectez-vous à votre espace candidat pour plus de détails.</p>
      </div>
    </div>`
}
