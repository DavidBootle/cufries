import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// pages/_app.js
import { Libre_Franklin } from '@next/font/google'
import { Toaster } from 'react-hot-toast'

// If loading a variable font, you don't need to specify the font weight
const inter = Libre_Franklin({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Toaster position='bottom-center' reverseOrder={true} />
      <Component {...pageProps} />
    </main>
  )
}
