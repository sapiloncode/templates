import { Layout } from '@/components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout title="Welcome" description="A simple and modern website template">
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Welcome to Your Website</h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            A clean and simple website template built with Next.js and Tailwind CSS
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/about"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
