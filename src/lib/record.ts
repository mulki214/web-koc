export type ApprovedBout = { redFighterId: string; result: { winner: 'RED'|'BLUE'|'DRAW'|'NO_CONTEST'; method: string | null } | null }
export function calculateRecord(fighterId: string, bouts: ApprovedBout[]) {
  return bouts.reduce((record, bout) => {
    const side = bout.redFighterId === fighterId ? 'RED' : 'BLUE'
    if (bout.result?.winner === 'DRAW') record.draws++
    else if (bout.result?.winner === side) { record.wins++; if (/\b(?:KO|TKO)\b/i.test(bout.result.method || '')) record.knockouts++ }
    else if (bout.result && bout.result.winner !== 'NO_CONTEST') record.losses++
    return record
  }, { wins: 0, losses: 0, draws: 0, knockouts: 0 })
}
