export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAboutSettings } from '@/lib/about'
export const metadata:Metadata={title:'Tentang Kami',description:'Mengenal Knockout Club dan visi untuk tinju Indonesia.',alternates:{canonical:'/about'}}
export default async function AboutPage(){const about=await getAboutSettings();return <main><section className="page-hero"><div className="container"><span className="eyebrow">THE CLUB / 05</span><h1>BUILT FOR<br/><span>THE FIGHT.</span></h1><p>{about.intro}</p></div></section><section className="section"><div className="container detail-grid"><div><span className="eyebrow">OUR PURPOSE</span><h2 className="section-heading">MORE THAN THE RING.</h2><p className="prose">{about.purpose}</p></div><aside className="detail-panel"><span className="eyebrow">WORK WITH US</span><h3>Jadilah bagian dari cerita berikutnya.</h3><p style={{color:'var(--muted)',lineHeight:1.6}}>{about.partnership}</p><Link className="button" href="/contact">HUBUNGI KAMI ↗</Link></aside></div></section></main>}
