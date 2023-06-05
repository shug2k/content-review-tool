import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Content Moderation Tool',
  description: 'Tool to evaluate content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex bg-white border border-gray-300 items-center w-full h-16">
          <p className="text-3xl font-medium px-4">Content Moderation Tool</p>
        </div>
        {children}
      </body>
    </html>
  )
}
