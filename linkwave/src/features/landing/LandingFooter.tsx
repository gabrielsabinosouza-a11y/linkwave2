import Image from 'next/image'
import Link from 'next/link'

export default function LandingFooter() {
  return (
    <footer className="container mx-auto px-4 pb-8">
      <div className="glass p-5 flex flex-col md:flex-row justify-between items-center text-muted-ocean text-sm gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={20} height={20} className="opacity-70" />
          <span className="font-bold text-ocean-light">LinkWave</span>
        </Link>
        <div>© 2026 LinkWave — Todos os direitos reservados</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-ocean transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-ocean transition-colors">Termos</Link>
        </div>
      </div>
    </footer>
  )
}
