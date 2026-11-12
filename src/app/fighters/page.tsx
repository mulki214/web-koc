export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getFighters } from '@/lib/content'
import { isDemo } from '@/lib/demo'
import { FighterCard } from '@/components/Cards'
export const metadata: Metadata = { title: 'Fighters', description: 'Kenali petinju Knockout Club.', alternates: { canonical: '/fighters' } }
export default async function FightersPage({ searchParams }: { searchParams: Promise<{ q?: string; division?: string; gym?: string; category?: string }> }) {
 const filters=await searchParams
 const fighters=await getFighters()
 const divisions=[...new Set(fighters.map(f=>f.weightClass).filter(Boolean))] as string[]
 const gyms=[...new Set(fighters.map(f=>'gym' in f?f.gym?.name:null).filter(Boolean))] as string[]
 const filtered=fighters.filter(f=>(!filters.q||f.fullName.toLowerCase().includes(filters.q.toLowerCase()))&&(!filters.division||f.weightClass===filters.division)&&(!filters.gym||('gym' in f&&f.gym?.name===filters.gym))&&(!filters.category||f.category===filters.category))
 return <main><section className="page-hero"><div className="container"><span className="eyebrow">THE TALENT / 02</span><h1>FIGHTERS<span>.</span></h1><p>Kenali sosok di balik setiap ronde. Profil resmi hanya dipublikasikan setelah diverifikasi.</p></div></section><section className="section"><div className="container"><form className="search-bar" action="/fighters"><input className="field" type="search" name="q" defaultValue={filters.q} placeholder="Cari nama petinju" aria-label="Cari nama petinju"/><select className="field" name="division" defaultValue={filters.division||''} aria-label="Filter kelas berat"><option value="">Semua kelas</option>{divisions.map(d=><option key={d}>{d}</option>)}</select><select className="field" name="gym" defaultValue={filters.gym||''} aria-label="Filter gym"><option value="">Semua gym</option>{gyms.map(g=><option key={g}>{g}</option>)}</select><select className="field" name="category" defaultValue={filters.category||''} aria-label="Filter kategori"><option value="">Semua kategori</option><option value="PROFESSIONAL">Profesional</option><option value="AMATEUR">Amatir</option></select><button className="button" type="submit">CARI ↗</button></form><div className="grid grid-3">{filtered.map(f=><FighterCard key={f.slug} fighter={f} demo={isDemo}/>)}</div>{!filtered.length&&<div className="empty-state">Tidak ada profil yang sesuai.</div>}</div></section></main>
}
