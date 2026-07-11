// ── calcPts ──
// Para partidos normales (grupos): ph, pa vs rh, ra, sp
// Para eliminatorias con posible empate y penaltis:
//   - r.penalty_winner: nombre del equipo que ganó en penaltis (si hubo empate)
//   - pred.penalty_winner: pronóstico del jugador de quién gana en penaltis
//
// Sistema de puntos en eliminatorias con empate real:
//   Pronóstico de empate + aciertas ganador penaltis + marcador exacto = +3 (base)
//   Pronóstico de empate + aciertas ganador penaltis                   = +2
//   Pronóstico de empate (sin acertar ganador)                         = +1
//   Pronóstico de victoria al equipo que gana (pero no empate)         = +1
//   Cualquier otra cosa                                                 = 0
//
// Multiplicador ×2 (sp): solo aplica si uno de los equipos es España

export function calcPts(ph, pa, rh, ra, sp, el, penaltyWinner, predPenaltyWinner) {
  if (rh == null || ra == null) return null
  if (ph == null || pa == null) return 0

  const mult = sp ? 2 : 1
  const realDraw = rh === ra
  const predDraw = ph === pa

  // Resultado real con empate en eliminatorias (hubo penaltis)
  if (el && realDraw && penaltyWinner) {
    if (predDraw) {
      // Acertó el empate — veamos si también acertó penaltis y/o marcador
      const acertoPenaltis = predPenaltyWinner && predPenaltyWinner === penaltyWinner
      const acertoMarcador = ph === rh && pa === ra // siempre true si predDraw y realDraw
      if (acertoPenaltis) return 3 * mult  // empate + ganador penaltis + marcador exacto
      return 1 * mult                       // empate solo
    } else {
      // No pronosticó empate — ¿pronosticó victoria al que ganó en penaltis?
      const predWinner = ph > pa ? 'H' : 'A'
      const realWinner = penaltyWinner // nombre del equipo
      // Necesitamos saber si el pronóstico favorece al ganador real
      // Se resuelve en App.jsx pasando 'H' o 'A' como predPenaltyWinner cuando no hay empate
      if (predPenaltyWinner && predPenaltyWinner === 'winner') return 1 * mult
      return 0
    }
  }

  // Resultado normal (sin empate en elim, o partido de grupos)
  if (ph === rh && pa === ra) return 3 * mult

  const predTend = ph > pa ? 'H' : ph < pa ? 'A' : 'D'
  const realTend = rh > ra ? 'H' : rh < ra ? 'A' : 'D'

  // En eliminatorias sin empate real, empate pronosticado = 0
  if (el && realTend !== 'D' && predTend === 'D') return 0

  return predTend === realTend ? 1 * mult : 0
}

// Versión simplificada que App.jsx puede llamar con todos los datos del partido
export function calcElimPts(pred, result, hTeam, aTeam, sp) {
  if (!result || result.home_goals == null) return null
  if (!pred || pred.home_goals == null) return 0

  const ph = parseInt(pred.home_goals), pa = parseInt(pred.away_goals)
  const rh = parseInt(result.home_goals), ra = parseInt(result.away_goals)
  const mult = sp ? 2 : 1
  const realDraw = rh === ra

  if (realDraw && result.penalty_winner) {
    if (ph === pa) {
      const acertoPenaltis = pred.penalty_winner === result.penalty_winner
      const acertoMarcador = ph === rh && pa === ra
      if (acertoPenaltis && acertoMarcador) return 3 * mult
      if (acertoPenaltis) return 2 * mult
      return 1 * mult
    } else {
      const predWinner = ph > pa ? hTeam : aTeam
      if (predWinner === result.penalty_winner) return 1 * mult
      return 0
    }
  }

  // Sin penaltis: lógica normal
  if (ph === rh && pa === ra) return 3 * mult
  const predTend = ph > pa ? 'H' : ph < pa ? 'A' : 'D'
  const realTend = rh > ra ? 'H' : rh < ra ? 'A' : 'D'
  if (realTend === 'D') return 0 // no debería pasar en elim sin penalty_winner
  if (predTend === 'D') return 0
  return predTend === realTend ? 1 * mult : 0
}

export function calcGroupPts(pred, result, sp) {
  if (!result || result.home_goals == null) return null
  if (!pred || pred.home_goals == null) return 0
  const ph = parseInt(pred.home_goals), pa = parseInt(pred.away_goals)
  const rh = parseInt(result.home_goals), ra = parseInt(result.away_goals)
  const mult = sp ? 2 : 1
  if (ph === rh && pa === ra) return 3 * mult
  const predTend = ph > pa ? 'H' : ph < pa ? 'A' : 'D'
  const realTend = rh > ra ? 'H' : rh < ra ? 'A' : 'D'
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
