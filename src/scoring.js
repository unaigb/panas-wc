export function calcPts(ph, pa, rh, ra, sp, el) {
  if (rh == null || ra == null) return null
  if (ph == null || pa == null) return 0
  const mult = sp ? 2 : 1
  if (ph === rh && pa === ra) return 3 * mult
  const predTend = ph > pa ? 'H' : ph < pa ? 'A' : 'D'
  const realTend = rh > ra ? 'H' : rh < ra ? 'A' : 'D'
  if (el && realTend === 'D') return 0
  return predTend === realTend ? 1 * mult : 0
}

export function hashPass(p) {
  let h = 0
  for (let i = 0; i < p.length; i++) h = Math.imul(31, h) + p.charCodeAt(i) | 0
  return h.toString(36)
}

export function fmtD(d) {
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function fmtT(d) {
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
