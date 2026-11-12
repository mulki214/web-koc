export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { loginAction } from '@/app/actions'
import { getAdmin } from '@/lib/auth'
export const metadata:Metadata={title:'Admin Login',robots:{index:false,follow:false}}
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}){if(await getAdmin())redirect('/admin');const q=await searchParams;return <main className="admin-shell"><div className="container"><span className="eyebrow">EDITOR ACCESS</span><h1 className="section-heading">ADMIN LOGIN</h1><div className="admin-card" style={{maxWidth:520}}>{!process.env.DATABASE_URL&&<p className="notice">Mode demo: admin tersedia setelah PostgreSQL dan akun editor dikonfigurasi.</p>}{q.error&&<p className="notice">{q.error==='setup'?'Konfigurasi database diperlukan.':'Email atau kata sandi tidak sesuai.'}</p>}<form className="form-stack" action={loginAction}><label>Email<input className="field" type="email" name="email" required autoComplete="username"/></label><label>Kata sandi<input className="field" type="password" name="password" required autoComplete="current-password"/></label><button className="button" type="submit">MASUK ↗</button></form></div></div></main>}
