import ContactForm from '@/components/ContactForm'
import { Layout } from '@/components/Layout'

export default function Contact() {
  return (
    <Layout title="Contact Us" description="Get in touch with us">
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Contact Us</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Have a question or want to get in touch? We&apos;d love to hear from you. Fill out the form below and
              we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}
