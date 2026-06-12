import { GROUP_TEAMS, GROUP_MATCHES, ELIM_MATCHES } from './matches.js'

export function calcGroupTable(groupLetter, results) {
  const teams = GROUP_TEAMS[groupLetter]
  if (!teams) return []
  const stats = {}
  teams.forEach(t => { stats[t] = { team: t, grp: groupLetter, pts: 0, pj: 0, gf: 0, gc: 0, gd: 0 } })

  GROUP_MATCHES.filter(m => m.gr === groupLetter).forEach(m => {
    const r = results[m.id]
    if (!r || r.home_goals == null) return
    const rh = parseInt(r.home_goals), ra = parseInt(r.away_goals)
    if (isNaN(rh) || isNaN(ra)) return
    if (!stats[m.h] || !stats[m.a]) return
    stats[m.h].pj++; stats[m.a].pj++
    stats[m.h].gf += rh; stats[m.h].gc += ra; stats[m.h].gd += rh - ra
    stats[m.a].gf += ra; stats[m.a].gc += rh; stats[m.a].gd += ra - rh
    if (rh > ra) { stats[m.h].pts += 3 }
    else if (rh < ra) { stats[m.a].pts += 3 }
    else { stats[m.h].pts++; stats[m.a].pts++ }
  })

  return Object.values(stats).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

export function getBest3rds(results) {
  return Object.keys(GROUP_TEAMS)
    .map(g => {
      const t = calcGroupTable(g, results)
      return t[2] ? { ...t[2], grp: g } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    .slice(0, 8)
}

export function resolveTeam(label, results, elimResults) {
  if (!label) return null

  // Ganador de partido eliminatorio: "G P73"
  const gMatch = /^G P(\d+)$/.exec(label)
  if (gMatch) {
    const mid = parseInt(gMatch[1])
    const r = elimResults[mid]
    if (!r || r.home_goals == null) return null
    const m = ELIM_MATCHES.find(x => x.id === mid)
    if (!m) return null
    const rh = parseInt(r.home_goals), ra = parseInt(r.away_goals)
    if (isNaN(rh) || isNaN(ra) || rh === ra) return null
    const hTeam = resolveTeam(m.hLabel, results, elimResults) || m.hLabel
    const aTeam = resolveTeam(m.aLabel, results, elimResults) || m.aLabel
    return rh > ra ? hTeam : aTeam
  }

  // Perdedor de partido eliminatorio: "P P101"
  const pMatch = /^P P(\d+)$/.exec(label)
  if (pMatch) {
    const mid = parseInt(pMatch[1])
    const r = elimResults[mid]
    if (!r || r.home_goals == null) return null
    const m = ELIM_MATCHES.find(x => x.id === mid)
    if (!m) return null
    const rh = parseInt(r.home_goals), ra = parseInt(r.away_goals)
    if (isNaN(rh) || isNaN(ra) || rh === ra) return null
    const hTeam = resolveTeam(m.hLabel, results, elimResults) || m.hLabel
    const aTeam = resolveTeam(m.aLabel, results, elimResults) || m.aLabel
    return rh < ra ? hTeam : aTeam
  }

  // 1º o 2º de grupo: "1ºA", "2ºB"
  const posMatch = /^([12])º([A-L])$/.exec(label)
  if (posMatch) {
    const pos = parseInt(posMatch[1]) - 1
    const g = posMatch[2]
    const t = calcGroupTable(g, results)
    return t[pos]?.team || null
  }

  // 3º mejor entre grupos: "3ºA/B/C/D/F"
  const thirdsMatch = /^3º([A-L/]+)$/.exec(label)
  if (thirdsMatch) {
    const grps = thirdsMatch[1].split('/')
    const best3 = getBest3rds(results).filter(x => grps.includes(x.grp))
    return best3[0]?.team || null
  }

  return null
}

export function getTeamName(m, side, results, elimResults) {
  if (!m.hLabel) return side === 'h' ? m.h : m.a
  const label = side === 'h' ? m.hLabel : m.aLabel
  return resolveTeam(label, results, elimResults) || label
}

// ── Bonus "peor selección" ──
// Recorre todos los partidos jugados (grupos + eliminatorias) buscando
// los que involucran a `teamName`, suma sus goles a favor (gf) y en contra (gc).
// Reglas: +1 si gf >= 1 (marcó al menos un gol en el torneo)
//         +1 si gc >= 3 (recibió 3 o más goles en el torneo)
export function calcWorstTeamBonus(teamName, results, elimResults) {
  if (!teamName) return { gf: 0, gc: 0, bonus: 0, played: 0 }
  let gf = 0, gc = 0, played = 0

  // Partidos de grupos (nombres fijos)
  GROUP_MATCHES.forEach(m => {
    const r = results[m.id]
    if (!r || r.home_goals == null) return
    const rh = parseInt(r.home_goals), ra = parseInt(r.away_goals)
    if (isNaN(rh) || isNaN(ra)) return
    if (m.h === teamName) { gf += rh; gc += ra; played++ }
    else if (m.a === teamName) { gf += ra; gc += rh; played++ }
  })

  // Partidos de eliminatorias (nombres resueltos dinámicamente)
  ELIM_MATCHES.forEach(m => {
    const r = elimResults[m.id]
    if (!r || r.home_goals == null) return
    const rh = parseInt(r.home_goals), ra = parseInt(r.away_goals)
    if (isNaN(rh) || isNaN(ra)) return
    const hTeam = resolveTeam(m.hLabel, results, elimResults)
    const aTeam = resolveTeam(m.aLabel, results, elimResults)
    if (hTeam === teamName) { gf += rh; gc += ra; played++ }
    else if (aTeam === teamName) { gf += ra; gc += rh; played++ }
  })

  let bonus = 0
  if (gf >= 1) bonus += 1
  bonus += Math.floor(gc / 3)

  return { gf, gc, bonus, played }
}
