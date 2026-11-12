import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateRecord } from '../src/lib/record'
import { instagramEmbedUrl } from '../src/lib/social'

test('verified bout record counts wins, losses, draws and KO only', () => {
  const record = calculateRecord('a', [
    { redFighterId:'a', result:{ winner:'RED', method:'TKO' } },
    { redFighterId:'b', result:{ winner:'RED', method:'Decision' } },
    { redFighterId:'a', result:{ winner:'DRAW', method:null } },
    { redFighterId:'a', result:{ winner:'NO_CONTEST', method:null } },
  ])
  assert.deepEqual(record, {wins:1,losses:1,draws:1,knockouts:1})
})
test('Instagram embeds accept only official HTTPS post or Reel URLs', () => {
  assert.equal(instagramEmbedUrl('https://www.instagram.com/p/Abc_123/'), 'https://www.instagram.com/p/Abc_123/embed/')
  assert.equal(instagramEmbedUrl('https://instagram.com/reel/XYZ-9/'), 'https://www.instagram.com/reel/XYZ-9/embed/')
  assert.equal(instagramEmbedUrl('https://evil.example/p/Abc_123/'), null)
  assert.equal(instagramEmbedUrl('http://www.instagram.com/p/Abc_123/'), null)
  assert.equal(instagramEmbedUrl('https://www.instagram.com/knockout.club_id/'), null)
})
