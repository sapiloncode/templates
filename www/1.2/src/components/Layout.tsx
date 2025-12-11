import { Footer } from '@/components/Footer'
import { NavBar } from '@/components/NavBar'
import '@/styles/globals.scss'
import Head from 'next/head'
import { PropsWithChildren } from 'react'

type Props = {
  title: string
  description?: string
}

export function Layout({ title, children, description }: PropsWithChildren & Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {!!description && <meta name="description" content={description} />}
      </Head>
      <NavBar />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
