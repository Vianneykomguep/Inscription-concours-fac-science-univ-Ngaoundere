import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
const smtpPort = parseInt(process.env.SMTP_PORT || '587')
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@univ-ndere.cm'

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
})

export async function sendEmail(to: string, subject: string, html: string, attachments: Mail.Attachment[] = []) {
  if (!smtpUser || !smtpPass) {
    console.error('Email configuration missing: SMTP_USER and SMTP_PASS are required.')
    return false
  }

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to, subject, html, attachments,
    })
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export function candidatureReceiptEmailTemplate(name: string, concours: string, numeroDossier: string, receiptUrl?: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#006633;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">Universite de Ngaoundere</h1>
        <p style="color:#CC9900;margin:5px 0 0;">Faculte des Sciences</p>
      </div>
      <div style="padding:30px;background:#f8f9fa;border:1px solid #e9ecef;">
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre candidature au concours <strong>${concours}</strong> a bien ete enregistree.</p>
        <p>Numero de dossier : <strong>${numeroDossier}</strong></p>
        <p>Votre recepisse imprimable est joint a cet email.</p>
        ${receiptUrl ? `<p>Vous pouvez aussi le telecharger depuis votre espace candidat : <a href="${receiptUrl}">${receiptUrl}</a></p>` : ''}
      </div>
    </div>`
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

export function statusChangeEmailTemplate(name: string, concours: string, statut: string, motif: string): string {
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

export function notificationEmailTemplate(name: string, title: string, content: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#006633;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">Universite de Ngaoundere</h1>
        <p style="color:#CC9900;margin:5px 0 0;">Faculte des Sciences</p>
      </div>
      <div style="padding:30px;background:#f8f9fa;border:1px solid #e9ecef;">
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Vous avez une nouvelle notification :</p>
        <h2 style="font-size:20px;color:#006633;margin:20px 0 10px;">${title}</h2>
        <p style="line-height:1.6;color:#334155;">${content}</p>
        <p style="margin-top:24px;">Connectez-vous a votre espace candidat pour consulter les details.</p>
      </div>
    </div>`
}

export function passwordResetEmailTemplate(name: string, otp: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#006633;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">Universite de Ngaoundere</h1>
        <p style="color:#CC9900;margin:5px 0 0;">Faculte des Sciences</p>
      </div>
      <div style="padding:30px;background:#f8f9fa;border:1px solid #e9ecef;">
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Vous avez demande la reinitialisation de votre mot de passe.</p>
        <p>Votre code de reinitialisation est :</p>
        <div style="text-align:center;margin:30px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#006633;">${otp}</span>
        </div>
        <p style="color:#666;font-size:14px;">Ce code expire dans 15 minutes. Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
      </div>
    </div>`
}
