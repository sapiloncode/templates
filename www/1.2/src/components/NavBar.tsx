import Link from 'next/link'
import { useRouter } from 'next/router'

export const NavBar = () => {
  const router = useRouter()
  const pathname = router.pathname

  return (
    <nav className="backdrop-blur-sm box-border z-10 fixed top-0 w-full inset-x-0 border-b border-white/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            Your Brand
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/about' ? 'text-white font-medium' : 'text-white/80 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/contact' ? 'text-white font-medium' : 'text-white/80 hover:text-white'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
