import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { isDemo } from '@/lib/demo'
export async function generateMetadata(): Promise<Metadata> { await headers(); const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://knockoutclub.id'; return { metadataBase: new URL(base), title: { default: 'Knockout Club — Tinju Indonesia', template: '%s | Knockout Club' }, description: 'Panggung untuk cerita, talenta, dan masa depan tinju Indonesia.', alternates: { canonical: '/' }, robots: isDemo ? { index: false, follow: false } : undefined, openGraph: { type: 'website', locale: 'id_ID', siteName: 'Knockout Club', images: ['/images/boxing-hero.webp'] }, twitter: { card: 'summary_large_image' } } }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html> }
