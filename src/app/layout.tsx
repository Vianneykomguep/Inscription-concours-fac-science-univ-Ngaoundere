import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Concours - Faculté des Sciences | Université de Ngaoundéré',
  description: 'Plateforme officielle d\'inscription en ligne aux concours de la Faculté des Sciences de l\'Université de Ngaoundéré.',
  keywords: 'concours, université, Ngaoundéré, inscription, Cameroun, faculté des sciences',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
