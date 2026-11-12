export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAboutSettings } from '@/lib/about'
import { getHomeSettings, homeSectionKeys } from '@/lib/home'
import { saveAboutAction, saveArticleAction, saveEventAction, saveFighterAction, saveFightAction, saveHighlightAction, saveMediaAction, saveSponsorAction, saveHomeAction } from '@/app/actions'
export const metadata: Metadata = { title: 'Kelola Konten', robots: { index: false, follow: false } }
function Status() { return <select className="field" name="status" defaultValue="DRAFT"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select> }
export default async function ContentPage({ searchParams }: { searchParams: Promise<{ done?: string; error?: string }> }) {
  await requireAdmin()
  const q = await searchParams
  const homeSettings = await getHomeSettings()
  const aboutSettings = await getAboutSettings()
  const [events, fighters, fights, articles, media, sponsors, posts] = await Promise.all([
    db.event.findMany({ orderBy: { updatedAt: 'desc' }, take: 30 }),
    db.fighter.findMany({ orderBy: { updatedAt: 'desc' }, take: 100 }),
    db.fight.findMany({ include: { event: true, redFighter: true, blueFighter: true }, orderBy: { updatedAt: 'desc' }, take: 20 }),
    db.article.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    db.mediaAsset.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    db.sponsor.findMany({ orderBy: { name: 'asc' }, take: 20 }),
    db.socialMediaPost.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  ])
  return <main className="admin-shell"><div className="container">
    <span className="eyebrow">CONTENT CONTROL</span><h1 className="section-heading">MANAGE CONTENT</h1>
    <div className="admin-tabs"><Link href="/admin">← Dashboard</Link><a href="#homepage">Homepage</a><a href="#events">Events</a><a href="#fighters">Fighters</a><a href="#fights">Fight card</a><a href="#articles">News</a><a href="#media">Media</a><a href="#sponsors">Sponsors</a><a href="#social">Instagram</a><a href="#about">About</a></div>
    {q.done && <p className="notice">Konten {q.done} berhasil disimpan.</p>}{q.error && <p className="notice">Data {q.error} belum valid. Periksa isian dan coba lagi.</p>}
    <section className="admin-card" id="homepage"><h2>HOMEPAGE</h2><p>Ubah pesan utama, tampilkan atau sembunyikan bagian beranda, dan atur urutannya.</p>
      <form className="form-stack" action={saveHomeAction}><label>Judul utama<input className="field" name="heroTitle" defaultValue={homeSettings.heroTitle} required maxLength={60}/></label><label>Kata merah<input className="field" name="heroAccent" defaultValue={homeSettings.heroAccent} required maxLength={30}/></label><label>Deskripsi<textarea className="field" name="heroDescription" defaultValue={homeSettings.heroDescription} maxLength={300}/></label>{homeSectionKeys.map(key=><div key={key} style={{display:'flex',gap:15,alignItems:'center',borderTop:'1px solid var(--line)',paddingTop:12}}><label style={{display:'flex',gap:8,alignItems:'center',flex:1}}><input type="checkbox" name={`${key}Visible`} value="yes" defaultChecked={homeSettings.sections[key].visible}/>{key.toUpperCase()}</label><label>Urutan<input className="field" type="number" name={`${key}Order`} min="1" max="99" defaultValue={homeSettings.sections[key].order} style={{width:90,minWidth:0}}/></label></div>)}<button className="button">SIMPAN BERANDA</button></form>
    </section>
    <section className="admin-card" id="events"><h2>EVENTS</h2><p>Gunakan slug yang sama untuk memperbarui entri. Jadwal dan tiket dapat ditambahkan pada fase operasi.</p>
      <form className="form-stack" action={saveEventAction}><label>Slug<input className="field" name="slug" required placeholder="nama-acara"/></label><label>Judul<input className="field" name="title" required/></label><label>Subjudul<input className="field" name="subtitle"/></label><label>Deskripsi<textarea className="field" name="description"/></label><label>Tanggal dan waktu (WIB)<input className="field" type="datetime-local" name="startsAt"/></label><label>Kota<input className="field" name="city"/></label><label>Venue<input className="field" name="venue"/></label><label>Poster HTTPS<input className="field" type="url" name="posterUrl"/></label><label>Info tiket HTTPS<input className="field" type="url" name="ticketUrl"/></label><label>Status acara<select className="field" name="eventStatus"><option value="UPCOMING">Akan datang</option><option value="COMPLETED">Selesai</option><option value="CANCELLED">Dibatalkan</option></select></label><label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" name="registrationOpen" value="yes"/>Pendaftaran dibuka</label><label>Status publikasi<Status/></label><button className="button">SIMPAN EVENT</button></form>
      <ul className="admin-list">{events.map(e => <li key={e.id}><span>{e.title}</span><span>{e.status}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="fighters"><h2>FIGHTERS</h2>
      <form className="form-stack" action={saveFighterAction}><label>Slug<input className="field" name="slug" required placeholder="nama-petinju"/></label><label>Nama lengkap<input className="field" name="fullName" required/></label><label>Biografi<textarea className="field" name="bio"/></label><label>Kelas<input className="field" name="weightClass"/></label><label>Asal<input className="field" name="hometown"/></label><label>Gym<input className="field" name="gymName"/></label><label>Pelatih<input className="field" name="coach"/></label><label>Foto profil HTTPS<input className="field" type="url" name="portraitUrl"/></label><label>Kategori<select className="field" name="category"><option value="PROFESSIONAL">Profesional</option><option value="AMATEUR">Amatir</option></select></label><label>Status<Status/></label><button className="button">SIMPAN FIGHTER</button></form>
      <ul className="admin-list">{fighters.map(f => <li key={f.id}><span>{f.fullName}</span><span>{f.status}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="fights"><h2>FIGHT CARD</h2><p>Buat atau perbarui pasangan pertandingan dengan nomor urut yang sama pada acara yang dipilih. Hasil pertandingan tetap memerlukan alur persetujuan pada fase berikutnya.</p>
      {events.length && fighters.length > 1 ? <form className="form-stack" action={saveFightAction}><label>Event<select className="field" name="eventId" required>{events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}</select></label><label>Red corner<select className="field" name="redFighterId" required>{fighters.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}</select></label><label>Blue corner<select className="field" name="blueFighterId" required>{fighters.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}</select></label><label>Urutan<input className="field" type="number" min="1" max="100" name="boutOrder" required/></label><label>Bagian kartu<select className="field" name="cardSection"><option value="MAIN_EVENT">Main event</option><option value="CO_MAIN">Co-main event</option><option value="UNDERCARD">Undercard</option><option value="PRELIMINARY">Preliminary</option></select></label><label>Divisi<input className="field" name="division"/></label><label>Ronde<input className="field" type="number" min="1" max="20" name="rounds" required/></label><button className="button">SIMPAN FIGHT</button></form> : <p className="notice">Buat satu event dan dua profil petinju terlebih dahulu.</p>}
      <ul className="admin-list">{fights.map(f => <li key={f.id}><span>{f.event.title}: {f.redFighter.fullName} vs {f.blueFighter.fullName}</span><span>{f.cardSection}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="articles"><h2>NEWS</h2>
      <form className="form-stack" action={saveArticleAction}><label>Slug<input className="field" name="slug" required placeholder="judul-artikel"/></label><label>Judul<input className="field" name="title" required/></label><label>Ringkasan<textarea className="field" name="excerpt"/></label><label>Isi artikel<textarea className="field" name="body" required minLength={10}/></label><label>Penulis<input className="field" name="authorName"/></label><label>Cover HTTPS<input className="field" type="url" name="coverUrl"/></label><label>SEO title<input className="field" name="seoTitle"/></label><label>SEO description<textarea className="field" name="seoDescription"/></label><label>Status<Status/></label><button className="button">SIMPAN ARTIKEL</button></form>
      <ul className="admin-list">{articles.map(a => <li key={a.id}><span>{a.title}</span><span>{a.status}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="media"><h2>MEDIA</h2><p>Gunakan URL HTTPS yang Anda miliki atau berhak tampilkan, serta cantumkan kredit yang sesuai.</p>
      <form className="form-stack" action={saveMediaAction}><label>Judul<input className="field" name="title" required/></label><label>Jenis<select className="field" name="kind"><option value="PHOTO">Foto</option><option value="VIDEO">Video</option></select></label><label>URL HTTPS<input className="field" type="url" name="url" required/></label><label>Kredit<input className="field" name="attribution"/></label><label>Status<Status/></label><button className="button">SIMPAN MEDIA</button></form>
      <ul className="admin-list">{media.map(m => <li key={m.id}><span>{m.title}</span><span>{m.status}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="sponsors"><h2>SPONSORS</h2><p>Nama sponsor tampil di beranda setelah disimpan. Gunakan hanya kemitraan yang sudah disetujui.</p>
      <form className="form-stack" action={saveSponsorAction}><label>Nama<input className="field" name="name" required/></label><label>Situs HTTPS<input className="field" type="url" name="websiteUrl"/></label><button className="button">SIMPAN SPONSOR</button></form>
      <ul className="admin-list">{sponsors.map(s => <li key={s.id}><span>{s.name}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="social"><h2>INSTAGRAM HIGHLIGHTS</h2><p>Hanya tautan post atau Reel Instagram resmi yang diterima. Embed memiliki fallback tautan asli.</p>
      <form className="form-stack" action={saveHighlightAction}><label>Judul<input className="field" name="title"/></label><label>URL post/Reel<input className="field" type="url" name="url" required placeholder="https://www.instagram.com/p/.../"/></label><button className="button">SIMPAN HIGHLIGHT</button></form>
      <ul className="admin-list">{posts.map(p => <li key={p.id}><span>{p.title || p.url}</span><span>{p.status}</span></li>)}</ul>
    </section>
    <section className="admin-card" id="about"><h2>ABOUT</h2><p>Ubah teks publik tentang Knockout Club setelah disetujui tim.</p><form className="form-stack" action={saveAboutAction}><label>Pengantar<textarea className="field" name="intro" defaultValue={aboutSettings.intro} required/></label><label>Tujuan<textarea className="field" name="purpose" defaultValue={aboutSettings.purpose} required/></label><label>Kemitraan<textarea className="field" name="partnership" defaultValue={aboutSettings.partnership} required/></label><button className="button">SIMPAN ABOUT</button></form></section>
  </div></main>
}
