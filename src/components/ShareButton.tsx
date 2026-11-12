'use client'
export function ShareButton({ title }: { title: string }) { return <button className="button button-outline" type="button" onClick={async () => { if (navigator.share) { try { await navigator.share({ title, url: location.href }) } catch {} } else { await navigator.clipboard.writeText(location.href); alert('Tautan disalin') } }}>BAGIKAN ↗</button> }
