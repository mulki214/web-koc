import { db } from './db'
import { isDemo } from './demo'
export const homeSectionKeys = ['events','fights','fighters','manifesto','news','instagram','videos','sponsors','newsletter'] as const
export type HomeSectionKey = typeof homeSectionKeys[number]
export type HomeSettings = { heroTitle: string; heroAccent: string; heroDescription: string; sections: Record<HomeSectionKey, { visible: boolean; order: number }> }
export const defaultHomeSettings: HomeSettings = {
  heroTitle: 'THE FIGHT STARTS', heroAccent: 'HERE.',
  heroDescription: 'Lebih dari sebuah pertandingan. Sebuah panggung untuk talenta, cerita, dan energi baru tinju Indonesia.',
  sections: Object.fromEntries(homeSectionKeys.map((key,index) => [key,{visible:true,order:index+1}])) as HomeSettings['sections']
}
export async function getHomeSettings(): Promise<HomeSettings> {
  if (isDemo) return defaultHomeSettings
  const row = await db.siteSetting.findUnique({ where: { key: 'homepage' } })
  const value = row?.value as Partial<HomeSettings> | undefined
  if (!value) return defaultHomeSettings
  const sections = Object.fromEntries(homeSectionKeys.map(key => {
    const source = value.sections?.[key]
    return [key,{ visible: typeof source?.visible === 'boolean' ? source.visible : true, order: Number.isFinite(source?.order) ? Number(source?.order) : defaultHomeSettings.sections[key].order }]
  })) as HomeSettings['sections']
  return { heroTitle: typeof value.heroTitle === 'string' ? value.heroTitle : defaultHomeSettings.heroTitle, heroAccent: typeof value.heroAccent === 'string' ? value.heroAccent : defaultHomeSettings.heroAccent, heroDescription: typeof value.heroDescription === 'string' ? value.heroDescription : defaultHomeSettings.heroDescription, sections }
}
