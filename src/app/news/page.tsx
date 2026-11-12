export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getArticles } from '@/lib/content'
import { isDemo } from '@/lib/demo'
import { ArticleCard } from '@/components/Cards'
export const metadata:Metadata={title:'News',description:'Kabar dan cerita dari Knockout Club.',alternates:{canonical:'/news'}}
export default async function NewsPage(){const articles=await getArticles();return <main><section className="page-hero"><div className="container"><span className="eyebrow">THE STORIES / 03</span><h1>THE <span>NEWS.</span></h1><p>Berita, cerita, dan perspektif dari dalam dan luar ring.</p></div></section><section className="section"><div className="container"><div className="grid grid-3">{articles.map(a=><ArticleCard key={a.slug} article={a} demo={isDemo}/>)}</div>{!articles.length&&<div className="empty-state">Belum ada artikel yang dipublikasikan.</div>}</div></section></main>}
