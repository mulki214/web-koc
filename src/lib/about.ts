import { db } from './db'
import { isDemo } from './demo'
export type AboutSettings = { intro: string; purpose: string; partnership: string }
export const defaultAboutSettings: AboutSettings = {
 intro: 'Knockout Club adalah ruang untuk mempertemukan olahraga, cerita, dan komunitas tinju Indonesia.',
 purpose: 'Kami membangun panggung digital untuk acara, petinju, dan cerita tinju. Situs ini sedang disiapkan sebagai pusat informasi resmi Knockout Club. Detail program, kemitraan, dan kegiatan akan diperbarui setelah diumumkan melalui kanal resmi.',
 partnership: 'Untuk kemitraan, kolaborasi acara, atau pertanyaan media, hubungi tim kami.'
}
export async function getAboutSettings(): Promise<AboutSettings> {
 if (isDemo) return defaultAboutSettings
 const row=await db.siteSetting.findUnique({where:{key:'about'}})
 const value=row?.value as Partial<AboutSettings>|undefined
 return {intro:typeof value?.intro==='string'?value.intro:defaultAboutSettings.intro,purpose:typeof value?.purpose==='string'?value.purpose:defaultAboutSettings.purpose,partnership:typeof value?.partnership==='string'?value.partnership:defaultAboutSettings.partnership}
}
