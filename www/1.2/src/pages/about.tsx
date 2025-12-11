import { Layout } from '@/components/Layout'
import { readMarkdownSync } from '@/utils/readMarkdownSync'

export default function About({ content }: { content: string }) {
  return (
    <Layout title="About" description="Learn more about us">
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-white/90">
          <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const content = readMarkdownSync(`about.md`)

  return {
    props: {
      content,
    },
  }
}
