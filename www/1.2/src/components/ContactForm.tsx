const ContactForm = () => {
  return (
    <form id="contactForm" method="POST" className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-white font-semibold">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/40"
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-white font-semibold">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/40"
          placeholder="your.email@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="block text-white font-semibold">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/40"
          rows={6}
          placeholder="Your message..."
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

export default ContactForm
