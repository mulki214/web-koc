export interface SocialMediaProvider {
  name: 'instagram' | 'tiktok' | 'youtube' | 'facebook'
  getProfile(): Promise<unknown>
  getMedia(): Promise<unknown>
  validateConnection(): Promise<boolean>
  getInsights?(): Promise<unknown>
  publishContent?(content: unknown): Promise<unknown>
}
export const INSTAGRAM_PROFILE = 'https://www.instagram.com/knockout.club_id/'
export function instagramEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(url.hostname)) return null
    const match = url.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/)
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : null
  } catch { return null }
}
