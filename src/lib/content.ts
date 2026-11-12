import { db } from './db'
import { demoArticle, demoEvent, demoFighters, isDemo } from './demo'
import { calculateRecord } from './record'

export async function getEvents() {
  if (isDemo) return [demoEvent]
  return db.event.findMany({ where: { status: 'PUBLISHED' }, orderBy: { startsAt: 'asc' } })
}
export async function getEvent(slug: string) {
  if (isDemo) return slug === demoEvent.slug ? demoEvent : null
  return db.event.findFirst({ where: { slug, status: 'PUBLISHED' } })
}
export async function getFights(eventId?: string) {
  if (isDemo || !eventId) return []
  return db.fight.findMany({ where: { eventId }, include: { redFighter: true, blueFighter: true, result: true }, orderBy: { boutOrder: 'asc' } })
}
export async function getFighters() {
  if (isDemo) return demoFighters
  return db.fighter.findMany({ where: { status: 'PUBLISHED' }, include: { gym: true }, orderBy: { fullName: 'asc' } })
}
export async function getFighter(slug: string) {
  if (isDemo) return demoFighters.find(f => f.slug === slug) ?? null
  return db.fighter.findFirst({ where: { slug, status: 'PUBLISHED' }, include: { gym: true, socials: true } })
}
export async function getArticles() {
  if (isDemo) return [demoArticle]
  return db.article.findMany({ where: { status: 'PUBLISHED', OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] }, orderBy: { publishedAt: 'desc' } })
}
export async function getArticle(slug: string) {
  if (isDemo) return slug === demoArticle.slug ? demoArticle : null
  return db.article.findFirst({ where: { slug, status: 'PUBLISHED', OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] } })
}
export async function getMedia() {
  if (isDemo) return []
  return db.mediaAsset.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } })
}
export async function getHighlights() {
  if (isDemo) return []
  return db.socialMediaPost.findMany({ where: { status: 'PUBLISHED', featured: true, account: { provider: 'INSTAGRAM' } }, orderBy: { createdAt: 'desc' }, take: 3 })
}
export async function getRecord(fighterId: string) {
  const fights = await db.fight.findMany({ where: { OR: [{ redFighterId: fighterId }, { blueFighterId: fighterId }], status: 'COMPLETED', result: { approvedAt: { not: null }, verified: true } }, include: { result: true } })
  return calculateRecord(fighterId, fights)
}
export async function getFighterFights(fighterId?: string) {
  if (isDemo || !fighterId) return []
  return db.fight.findMany({ where: { OR: [{ redFighterId: fighterId }, { blueFighterId: fighterId }], event: { status: 'PUBLISHED' } }, include: { event: true, redFighter: true, blueFighter: true, result: true }, orderBy: { event: { startsAt: 'desc' } } })
}
export async function getSponsors() {
  if (isDemo) return []
  return db.sponsor.findMany({ orderBy: { name: 'asc' } })
}
