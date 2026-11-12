export const dynamic = 'force-dynamic'
import type { MetadataRoute } from 'next'
import { getEvents, getFighters, getArticles } from '@/lib/content'
import { isDemo } from '@/lib/demo'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://knockoutclub.id';if(isDemo)return [];const [events,fighters,articles]=await Promise.all([getEvents(),getFighters(),getArticles()]);return ['','/events','/fighters','/news','/media','/about','/contact',...events.map(e=>`/events/${e.slug}`),...fighters.map(f=>`/fighters/${f.slug}`),...articles.map(a=>`/news/${a.slug}`)].map(path=>({url:base+path,changeFrequency:'weekly',priority:path===''?1:.6}))}
