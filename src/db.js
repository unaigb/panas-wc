import { supabase } from './supabase.js'

export async function loadAll() {
  const [users, results, preds, bonus, bonusSc, worstT] = await Promise.all([
    supabase.from('pwc_users').select('name, pass_hash'),
    supabase.from('pwc_results').select('match_id, home_goals, away_goals'),
    supabase.from('pwc_predictions').select('match_id, player_name, home_goals, away_goals'),
    supabase.from('pwc_bonus').select('player_name, champion, runner_up, top_scorer'),
    supabase.from('pwc_bonus_scores').select('player_name, champion_pts, runner_up_pts, scorer_pts'),
    supabase.from('pwc_worst_teams').select('player_name, team_name'),
  ])
  return {
    users: users.data || [],
    results: Object.fromEntries((results.data || []).map(r => [r.match_id, r])),
    preds: (preds.data || []).reduce((acc, r) => {
      if (!acc[r.match_id]) acc[r.match_id] = {}
      acc[r.match_id][r.player_name] = { home_goals: r.home_goals, away_goals: r.away_goals }
      return acc
    }, {}),
    bonus: Object.fromEntries((bonus.data || []).map(r => [r.player_name, r])),
    bonusSc: Object.fromEntries((bonusSc.data || []).map(r => [r.player_name, r])),
    worstT: Object.fromEntries((worstT.data || []).map(r => [r.player_name, r.team_name])),
  }
}

export async function registerUser(name, passHash) {
  const { error } = await supabase.from('pwc_users').insert({ name, pass_hash: passHash })
  if (error) throw error
}

export async function deleteUser(name) {
  // Borra el usuario y todos sus datos asociados (pronósticos, bonus, etc.)
  await supabase.from('pwc_predictions').delete().eq('player_name', name)
  await supabase.from('pwc_bonus').delete().eq('player_name', name)
  await supabase.from('pwc_bonus_scores').delete().eq('player_name', name)
  await supabase.from('pwc_worst_teams').delete().eq('player_name', name)
  const { error } = await supabase.from('pwc_users').delete().eq('name', name)
  if (error) throw error
}

export async function saveResult(matchId, homeGoals, awayGoals) {
  const { error } = await supabase.from('pwc_results').upsert({
    match_id: matchId, home_goals: homeGoals, away_goals: awayGoals,
    updated_at: new Date().toISOString()
  })
  if (error) throw error
}

export async function savePrediction(matchId, playerName, homeGoals, awayGoals) {
  const { error } = await supabase.from('pwc_predictions').upsert({
    match_id: matchId, player_name: playerName,
    home_goals: homeGoals, away_goals: awayGoals,
    updated_at: new Date().toISOString()
  })
  if (error) throw error
}

export async function saveBonus(playerName, field, value) {
  const col = { c: 'champion', s: 'runner_up', g: 'top_scorer' }[field]
  if (!col) return
  const { error } = await supabase.from('pwc_bonus').upsert({
    player_name: playerName, [col]: value,
    updated_at: new Date().toISOString()
  }, { onConflict: 'player_name', ignoreDuplicates: false })
  if (error) throw error
}

export async function saveBonusScore(playerName, field, value) {
  const col = { c: 'champion_pts', s: 'runner_up_pts', g: 'scorer_pts' }[field]
  if (!col) return
  const { error } = await supabase.from('pwc_bonus_scores').upsert({
    player_name: playerName, [col]: value,
    updated_at: new Date().toISOString()
  }, { onConflict: 'player_name', ignoreDuplicates: false })
  if (error) throw error
}

export async function saveWorstTeam(playerName, teamName) {
  const { error } = await supabase.from('pwc_worst_teams').upsert({
    player_name: playerName, team_name: teamName,
    updated_at: new Date().toISOString()
  })
  if (error) throw error
}
