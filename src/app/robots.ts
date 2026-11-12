import type { MetadataRoute } from 'next'
import { isDemo } from '@/lib/demo'
export const dynamic = 'force-dynamic'
export default function robots():MetadataRoute.Robots{const base=process.env.SITE_URL||'https://knockoutclub.id';return isDemo?{rules:{userAgent:'*',disallow:'/'}}:{rules:{userAgent:'*',allow:'/',disallow:'/admin/'},sitemap:`${base}/sitemap.xml`}}
