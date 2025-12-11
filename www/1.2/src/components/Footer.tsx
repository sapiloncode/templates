import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
