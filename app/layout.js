import './globals.css'
import { Outfit } from 'next/font/google' // Nova fonte

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  title: 'Inventory Cook ⚔️',
  description: 'Portfólio Gamificado',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
