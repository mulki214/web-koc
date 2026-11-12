import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from './db'
const cookieName = 'kc_session'
function secret() { const value = process.env.SESSION_SECRET; if (!value || value.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters'); return new TextEncoder().encode(value) }
export async function createSession(user: { id: string; role: string }) { const token = await new SignJWT({ role: user.role }).setProtectedHeader({alg:'HS256'}).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(secret()); (await cookies()).set(cookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*7}) }
export async function getAdmin() { if (!process.env.DATABASE_URL) return null; const token=(await cookies()).get(cookieName)?.value; if(!token)return null; try { const verified=await jwtVerify(token,secret()); const user=await db.user.findUnique({where:{id:verified.payload.sub}}); return user && ['SUPER_ADMIN','ADMIN','EDITOR'].includes(user.role) ? user : null } catch { return null } }
export async function requireAdmin(){const user=await getAdmin();if(!user)redirect('/admin/login');return user}
export async function clearSession(){(await cookies()).delete(cookieName)}
