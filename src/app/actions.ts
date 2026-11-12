'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { clearSession, createSession, requireAdmin } from '@/lib/auth'
import { isDemo } from '@/lib/demo'
import { instagramEmbedUrl } from '@/lib/social'
import { homeSectionKeys } from '@/lib/home'
const clean = (form: FormData, key: string) => String(form.get(key)||'').trim()
const slug = z.string().min(3).max(90).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export async function loginAction(form: FormData){if(isDemo)redirect('/admin/login?error=setup');const email=z.email().safeParse(clean(form,'email'));if(!email.success)redirect('/admin/login?error=invalid');const user=await db.user.findUnique({where:{email:email.data.toLowerCase()}});if(!user||!(await compare(clean(form,'password'),user.passwordHash)))redirect('/admin/login?error=invalid');await createSession(user);redirect('/admin')}
export async function logoutAction(){await clearSession();redirect('/admin/login')}
export async function contactAction(form: FormData){if(clean(form,'website'))redirect('/contact?sent=1');const parsed=z.object({name:z.string().min(2).max(100),email:z.email(),topic:z.enum(['general','sponsor','event','fighter']),message:z.string().min(10).max(3000)}).safeParse({name:clean(form,'name'),email:clean(form,'email'),topic:clean(form,'topic'),message:clean(form,'message')});if(!parsed.success||isDemo)redirect('/contact?error=1');const recent=await db.contactInquiry.count({where:{email:parsed.data.email,createdAt:{gte:new Date(Date.now()-3600000)}}});if(recent>=3)redirect('/contact?error=limit');await db.contactInquiry.create({data:parsed.data});redirect('/contact?sent=1')}
export async function subscribeAction(form: FormData){if(clean(form,'website'))redirect('/?subscribed=1');const parsed=z.email().safeParse(clean(form,'email'));if(!parsed.success||clean(form,'consent')!=='yes'||isDemo)redirect('/?subscribeError=1');await db.newsletterSubscriber.upsert({where:{email:parsed.data.toLowerCase()},create:{email:parsed.data.toLowerCase(),consentAt:new Date()},update:{}});redirect('/?subscribed=1')}
export async function saveEventAction(form: FormData) {
 const user = await requireAdmin()
 const startRaw = clean(form, 'startsAt')
 const startsAt = startRaw ? new Date(`${startRaw}+07:00`) : null
 const posterRaw = clean(form, 'posterUrl')
 const ticketRaw = clean(form, 'ticketUrl')
 const posterUrl = posterRaw ? httpsUrl(posterRaw) : null
 const ticketUrl = ticketRaw ? httpsUrl(ticketRaw) : null
 const parsed = z.object({ slug, title: z.string().min(3).max(140), subtitle: z.string().max(200), description: z.string().max(10000), city: z.string().max(100), venue: z.string().max(180), eventStatus: z.enum(['UPCOMING','COMPLETED','CANCELLED']), status: z.enum(['DRAFT','PUBLISHED']) }).safeParse({ slug: clean(form,'slug'), title: clean(form,'title'), subtitle: clean(form,'subtitle'), description: clean(form,'description'), city: clean(form,'city'), venue: clean(form,'venue'), eventStatus: clean(form,'eventStatus'), status: clean(form,'status') })
 if (!parsed.success || (startsAt && Number.isNaN(startsAt.getTime())) || (posterRaw && !posterUrl) || (ticketRaw && !ticketUrl)) redirect('/admin/content?error=event')
 const data = { ...parsed.data, startsAt, timezone: 'Asia/Jakarta', posterUrl, ticketUrl, registrationOpen: clean(form,'registrationOpen') === 'yes' }
 const item = await db.event.upsert({ where: { slug: data.slug }, create: data, update: data })
 await db.auditLog.create({ data: { actorId: user.id, action: 'UPSERT', entity: 'Event', entityId: item.id } })
 revalidatePath('/events'); revalidatePath('/'); redirect('/admin/content?done=event')
}
export async function saveFighterAction(form: FormData) {
 const user = await requireAdmin()
 const portraitRaw = clean(form,'portraitUrl')
 const portraitUrl = portraitRaw ? httpsUrl(portraitRaw) : null
 const parsed = z.object({ slug, fullName: z.string().min(3).max(140), bio: z.string().max(10000), weightClass: z.string().max(90), hometown: z.string().max(100), coach: z.string().max(100), category: z.enum(['PROFESSIONAL','AMATEUR']), status: z.enum(['DRAFT','PUBLISHED']) }).safeParse({ slug:clean(form,'slug'), fullName:clean(form,'fullName'), bio:clean(form,'bio'), weightClass:clean(form,'weightClass'), hometown:clean(form,'hometown'), coach:clean(form,'coach'), category:clean(form,'category'), status:clean(form,'status') })
 if (!parsed.success || (portraitRaw && !portraitUrl)) redirect('/admin/content?error=fighter')
 const gymName=clean(form,'gymName')
 if(gymName.length>120)redirect('/admin/content?error=fighter')
 const gym=gymName?await db.gym.upsert({where:{name:gymName},create:{name:gymName},update:{}}):null
 const data = { ...parsed.data, portraitUrl, gymId:gym?.id||null }
 const item = await db.fighter.upsert({ where: { slug: data.slug }, create: data, update: data })
 await db.auditLog.create({ data: { actorId: user.id, action: 'UPSERT', entity: 'Fighter', entityId: item.id } })
 revalidatePath('/fighters'); revalidatePath('/'); redirect('/admin/content?done=fighter')
}
export async function saveArticleAction(form: FormData) {
 const user = await requireAdmin()
 const coverRaw = clean(form,'coverUrl')
 const coverUrl = coverRaw ? httpsUrl(coverRaw) : null
 const parsed = z.object({ slug, title: z.string().min(3).max(180), excerpt: z.string().max(500), body: z.string().min(10).max(50000), authorName: z.string().max(100), seoTitle: z.string().max(180), seoDescription: z.string().max(300), status: z.enum(['DRAFT','PUBLISHED']) }).safeParse({ slug:clean(form,'slug'), title:clean(form,'title'), excerpt:clean(form,'excerpt'), body:clean(form,'body'), authorName:clean(form,'authorName'), seoTitle:clean(form,'seoTitle'), seoDescription:clean(form,'seoDescription'), status:clean(form,'status') })
 if (!parsed.success || (coverRaw && !coverUrl)) redirect('/admin/content?error=article')
 const existing = await db.article.findUnique({ where: { slug: parsed.data.slug } })
 const data = { ...parsed.data, coverUrl, publishedAt: parsed.data.status === 'PUBLISHED' ? existing?.publishedAt || new Date() : null }
 const item = await db.article.upsert({ where: { slug: data.slug }, create: data, update: data })
 await db.auditLog.create({ data: { actorId: user.id, action: 'UPSERT', entity: 'Article', entityId: item.id } })
 revalidatePath('/news'); revalidatePath('/'); redirect('/admin/content?done=article')
}
export async function saveHighlightAction(form:FormData){const user=await requireAdmin();const url=clean(form,'url');if(!instagramEmbedUrl(url))redirect('/admin/content?error=instagram');let account=await db.socialMediaAccount.findUnique({where:{provider_handle:{provider:'INSTAGRAM',handle:'knockout.club_id'}}});if(!account)account=await db.socialMediaAccount.create({data:{provider:'INSTAGRAM',handle:'knockout.club_id',profileUrl:'https://www.instagram.com/knockout.club_id/'}});const item=await db.socialMediaPost.upsert({where:{url},create:{url,accountId:account.id,title:clean(form,'title'),featured:true,status:'PUBLISHED'},update:{title:clean(form,'title'),featured:true,status:'PUBLISHED'}});await db.auditLog.create({data:{actorId:user.id,action:'UPSERT',entity:'SocialMediaPost',entityId:item.id}});revalidatePath('/media');revalidatePath('/');redirect('/admin/content?done=instagram')}
function httpsUrl(value:string){try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}}
export async function saveFightAction(form:FormData){const user=await requireAdmin();const parsed=z.object({eventId:z.string().min(1),redFighterId:z.string().min(1),blueFighterId:z.string().min(1),boutOrder:z.coerce.number().int().min(1).max(100),cardSection:z.enum(['MAIN_EVENT','CO_MAIN','UNDERCARD','PRELIMINARY']),division:z.string().max(80),rounds:z.coerce.number().int().min(1).max(20)}).safeParse({eventId:clean(form,'eventId'),redFighterId:clean(form,'redFighterId'),blueFighterId:clean(form,'blueFighterId'),boutOrder:clean(form,'boutOrder'),cardSection:clean(form,'cardSection'),division:clean(form,'division'),rounds:clean(form,'rounds')});if(!parsed.success||parsed.data.redFighterId===parsed.data.blueFighterId)redirect('/admin/content?error=fight');const item=await db.fight.upsert({where:{eventId_boutOrder:{eventId:parsed.data.eventId,boutOrder:parsed.data.boutOrder}},create:parsed.data,update:parsed.data});await db.auditLog.create({data:{actorId:user.id,action:'UPSERT',entity:'Fight',entityId:item.id}});revalidatePath('/events');revalidatePath('/fighters');revalidatePath('/');redirect('/admin/content?done=fight')}
export async function saveMediaAction(form:FormData){const user=await requireAdmin();const url=httpsUrl(clean(form,'url'));const parsed=z.object({title:z.string().min(3).max(160),kind:z.enum(['PHOTO','VIDEO']),attribution:z.string().max(200),status:z.enum(['DRAFT','PUBLISHED'])}).safeParse({title:clean(form,'title'),kind:clean(form,'kind'),attribution:clean(form,'attribution'),status:clean(form,'status')});if(!url||!parsed.success)redirect('/admin/content?error=media');const item=await db.mediaAsset.create({data:{...parsed.data,url}});await db.auditLog.create({data:{actorId:user.id,action:'CREATE',entity:'MediaAsset',entityId:item.id}});revalidatePath('/media');revalidatePath('/');redirect('/admin/content?done=media')}
export async function saveSponsorAction(form:FormData){const user=await requireAdmin();const name=clean(form,'name');const rawUrl=clean(form,'websiteUrl');const url=rawUrl?httpsUrl(rawUrl):null;if(name.length<2||name.length>120||(rawUrl&&!url))redirect('/admin/content?error=sponsor');const item=await db.sponsor.upsert({where:{name},create:{name,websiteUrl:url},update:{websiteUrl:url}});await db.auditLog.create({data:{actorId:user.id,action:'UPSERT',entity:'Sponsor',entityId:item.id}});revalidatePath('/');redirect('/admin/content?done=sponsor')}
export async function saveHomeAction(form:FormData){const user=await requireAdmin();const heroTitle=clean(form,'heroTitle');const heroAccent=clean(form,'heroAccent');const heroDescription=clean(form,'heroDescription');if(!heroTitle||heroTitle.length>60||!heroAccent||heroAccent.length>30||heroDescription.length>300)redirect('/admin/content?error=homepage');const sections=Object.fromEntries(homeSectionKeys.map(key=>[key,{visible:clean(form,`${key}Visible`)==='yes',order:Math.min(99,Math.max(1,Number(clean(form,`${key}Order`))||1))}]));await db.siteSetting.upsert({where:{key:'homepage'},create:{key:'homepage',value:{heroTitle,heroAccent,heroDescription,sections}},update:{value:{heroTitle,heroAccent,heroDescription,sections}}});await db.auditLog.create({data:{actorId:user.id,action:'UPSERT',entity:'SiteSetting',entityId:'homepage'}});revalidatePath('/');redirect('/admin/content?done=homepage')}
export async function saveAboutAction(form:FormData){const user=await requireAdmin();const parsed=z.object({intro:z.string().min(20).max(500),purpose:z.string().min(40).max(5000),partnership:z.string().min(20).max(1000)}).safeParse({intro:clean(form,'intro'),purpose:clean(form,'purpose'),partnership:clean(form,'partnership')});if(!parsed.success)redirect('/admin/content?error=about');await db.siteSetting.upsert({where:{key:'about'},create:{key:'about',value:parsed.data},update:{value:parsed.data}});await db.auditLog.create({data:{actorId:user.id,action:'UPSERT',entity:'SiteSetting',entityId:'about'}});revalidatePath('/about');redirect('/admin/content?done=about')}
