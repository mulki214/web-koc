export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getEvents } from '@/lib/content'
import { isDemo } from '@/lib/demo'
import { EventCard } from '@/components/Cards'
export const metadata: Metadata = { title: 'Events', description: 'Agenda acara Knockout Club.', alternates: { canonical: '/events' } }
export default async function EventsPage() { const events = await getEvents(); return <main><section className="page-hero"><div className="container"><span className="eyebrow">THE STAGE / 01</span><h1>EVENTS<span>.</span></h1><p>Semua momen besar dimulai di sini. Jelajahi acara dan ikuti perkembangan fight card.</p></div></section><section className="section"><div className="container"><div className="grid grid-3">{events.map(event => <EventCard key={event.slug} event={event} demo={isDemo}/>)}</div>{!events.length && <div className="empty-state">Belum ada acara yang dipublikasikan.</div>}</div></section></main> }
