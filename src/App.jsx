import { useState, useEffect, useCallback } from 'react'
import './styles.css'
import { ALL_MATCHES, GROUP_MATCHES, ELIM_MATCHES, ROUNDS, GROUP_TEAMS, WORST_TEAMS } from './matches.js'
import { calcGroupTable, getBest3rds, getTeamName } from './bracket.js'
import { calcPts, hashPass, fmtD, fmtT } from './scoring.js'
import { loadAll, registerUser, saveResult, savePrediction, saveBonus, saveBonusScore, saveWorstTeam } from './db.js'

const ADMIN_PASS = 'panas2026'
const BONUS_LOCK = new Date('2026-06-11T20:00:00+02:00')

export default function App() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [results, setResults] = useState({})
  const [elimResults, setElimResults] = useState({})
  const [preds, setPreds] = useState({})
  const [bonus, setBonus] = useState({})
  const [bonusSc, setBonusSc] = useState({})
  const [worstT, setWorstT] = useState({})

  const [view, setView] = useState('ranking')
  const [round, setRound] = useState('Grupos J1')
  const [me, setMe] = useState(() => sessionStorage.getItem('pwc_me') || null)
  const [admin, setAdmin] = useState(false)
  const [now, setNow] = useState(new Date())
  const [toast, setToast] = useState(null)

  const [modal, setModal] = useState(null)
  const [mName, setMName] = useState('')
  const [mPass, setMPass] = useState('')
  const [mPass2, setMPass2] = useState('')
  const [mErr, setMErr] = useState('')

  const [editId, setEditId] = useState(null)
  const [editH, setEditH] = useState('')
  const [editA, setEditA] = useState('')

  const allResults = { ...results, ...elimResults }

  // ── Load data ──
  useEffect(() => {
    loadAll().then(data => {
      setUsers(data.users)
      const gr = {}, er = {}
      Object.entries(data.results).forEach(([k, v]) => {
        const mid = parseInt(k)
        if (ELIM_MATCHES.find(m => m.id === mid)) er[mid] = v
        else gr[mid] = v
      })
      setResults(gr)
      setElimResults(er)
      setPreds(data.preds)
      setBonus(data.bonus)
      setBonusSc(data.bonusSc)
      setWorstT(data.worstT)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Refresh data every 30s
  useEffect(() => {
    const t = setInterval(() => {
      loadAll().then(data => {
        setUsers(data.users)
        const gr = {}, er = {}
        Object.entries(data.results).forEach(([k, v]) => {
          const mid = parseInt(k)
          if (ELIM_MATCHES.find(m => m.id === mid)) er[mid] = v
          else gr[mid] = v
        })
        setResults(gr)
        setElimResults(er)
        setPreds(data.preds)
        setBonus(data.bonus)
        setBonusSc(data.bonusSc)
        setWorstT(data.worstT)
      })
    }, 30000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const toast2 = useCallback((msg, err = false) => {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const openModal = (m) => { setModal(m); setMName(''); setMPass(''); setMPass2(''); setMErr('') }

  const players = users.map(u => u.name)
  const isLocked = m => now >= m.dt && !admin
  const hasRes = id => {
    const r = allResults[id]
    return r && r.home_goals != null
  }

  const getTeam = (m, side) => getTeamName(m, side, results, elimResults)

  // ── Auth ──
  const doJoin = async () => {
    const name = mName.trim().toUpperCase()
    if (!name || name.length < 2) { setMErr('Nombre demasiado corto'); return }
    if (!mPass || mPass.length < 4) { setMErr('Contraseña de al menos 4 caracteres'); return }
    if (mPass !== mPass2) { setMErr('Las contraseñas no coinciden'); return }
    if (users.find(u => u.name === name)) { setMErr('Ese nombre ya existe'); return }
    try {
      await registerUser(name, hashPass(mPass))
      setUsers(prev => [...prev, { name, pass_hash: hashPass(mPass) }])
      setMe(name); sessionStorage.setItem('pwc_me', name)
      setModal(null); setView('preds')
      toast2(`¡Bienvenido/a, ${name}! 🎉`)
    } catch (e) {
      setMErr('Error al registrar. Inténtalo de nuevo.')
    }
  }

  const doLogin = () => {
    const name = mName.trim().toUpperCase()
    const user = users.find(u => u.name === name)
    if (!user) { setMErr('Usuario no encontrado'); return }
    if (user.pass_hash !== hashPass(mPass)) { setMErr('Contraseña incorrecta'); return }
    setMe(name); sessionStorage.setItem('pwc_me', name)
    setModal(null); toast2(`¡Hola de nuevo, ${name}!`)
  }

  const doAdmin = () => {
    if (mPass === ADMIN_PASS) { setAdmin(true); setModal(null); setMPass(''); toast2('Modo admin activado 🔐') }
    else setMErr('Contraseña incorrecta')
  }

  const doLogout = () => {
    setMe(null); sessionStorage.removeItem('pwc_me'); toast2('Sesión cerrada')
  }

  // ── Save actions ──
  const doSaveResult = async (mid, h, a) => {
    try {
      await saveResult(mid, parseInt(h), parseInt(a))
      const newR = { match_id: mid, home_goals: parseInt(h), away_goals: parseInt(a) }
      if (ELIM_MATCHES.find(m => m.id === mid)) setElimResults(prev => ({ ...prev, [mid]: newR }))
      else setResults(prev => ({ ...prev, [mid]: newR }))
      toast2('Resultado guardado ✓'); setEditId(null)
    } catch { toast2('Error al guardar', true) }
  }

  const doSavePred = async (mid, h, a) => {
    const m = ALL_MATCHES.find(x => x.id === mid)
    if (!m || !me) return
    if (now >= m.dt && !admin) { toast2('Partido bloqueado 🔒', true); return }
    try {
      await savePrediction(mid, me, parseInt(h), parseInt(a))
      setPreds(prev => ({ ...prev, [mid]: { ...(prev[mid] || {}), [me]: { home_goals: parseInt(h), away_goals: parseInt(a) } } }))
      toast2('Pronóstico guardado ✓')
    } catch { toast2('Error al guardar', true) }
  }

  // ── Scoring ──
  const getR = id => allResults[id]
  const playerPts = p => {
    let tot = 0
    ALL_MATCHES.forEach(m => {
      if (!hasRes(m.id)) return
      const pd = preds[m.id]?.[p]
      const r = getR(m.id)
      const pts = calcPts(pd?.home_goals, pd?.away_goals, r?.home_goals, r?.away_goals, m.sp, m.el)
      if (pts !== null) tot += pts || 0
    })
    const bs = bonusSc[p] || {}
    return tot + (bs.champion_pts || 0) + (bs.runner_up_pts || 0) + (bs.scorer_pts || 0)
  }
  const playerEx = p => {
    let tot = 0
    ALL_MATCHES.forEach(m => {
      if (!hasRes(m.id)) return
      const pd = preds[m.id]?.[p]
      const r = getR(m.id)
      const pts = calcPts(pd?.home_goals, pd?.away_goals, r?.home_goals, r?.away_goals, m.sp, m.el)
      if (pts >= 3) tot++
    })
    return tot
  }

  const ranking = [...players].map(p => ({
    p, pts: playerPts(p), ex: playerEx(p),
    cb: bonusSc[p]?.champion_pts || 0
  })).sort((a, b) => b.pts - a.pts || b.ex - a.ex || b.cb - a.cb)

  // ── MATCH ROW (predictions view) ──
  const MatchRow = ({ m }) => {
    const pl = me
    const locked = now >= m.dt && !admin
    const pd = preds[m.id]?.[pl]
    const r = getR(m.id) || {}
    const pts = hasRes(m.id) ? calcPts(pd?.home_goals, pd?.away_goals, r.home_goals, r.away_goals, m.sp, m.el) : null
    const [lh, setLh] = useState(pd?.home_goals != null ? String(pd.home_goals) : '')
    const [la, setLa] = useState(pd?.away_goals != null ? String(pd.away_goals) : '')
    useEffect(() => {
      setLh(pd?.home_goals != null ? String(pd.home_goals) : '')
      setLa(pd?.away_goals != null ? String(pd.away_goals) : '')
    }, [pd?.home_goals, pd?.away_goals])

    const hName = m.hLabel ? getTeam(m, 'h') : m.h
    const aName = m.hLabel ? getTeam(m, 'a') : m.a
    const ptColor = pts === null ? '' : pts >= 3 ? 'g' : pts >= 1 ? 'y' : 'r'
    const ptLabel = pts === null ? '—' : pts >= 6 ? `+${pts}⚡` : pts >= 3 ? '+3' : pts >= 1 ? '+1' : '0'
    const rowBg = pts === null ? '' : pts >= 3 ? 'rgba(16,185,129,.05)' : pts >= 1 ? 'rgba(251,191,36,.07)' : 'rgba(239,68,68,.05)'

    return (
      <tr style={{ background: rowBg }}>
        <td className="td">
          <div className="match-date">{fmtD(m.dt)} {fmtT(m.dt)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
            {m.sp && <span className="match-tag match-tag-sp">×2</span>}
            {m.el && <span className="match-tag match-tag-elim" style={{ fontSize: 10 }}>{m.rd.includes('Final') ? '🏆' : m.rd.charAt(0)}</span>}
            <span style={{ fontWeight: 500 }}>{hName}</span>
            <span style={{ color: '#78716c', fontSize: 12 }}>vs</span>
            <span style={{ fontWeight: 500 }}>{aName}</span>
          </div>
        </td>
        <td className="td center">
          {hasRes(m.id) ? <b>{r.home_goals}-{r.away_goals}</b> :
            now >= m.dt ? <span style={{ fontSize: 11, animation: 'pulse 1.5s infinite' }}>En juego</span> :
              <span style={{ color: '#78716c' }}>—</span>}
        </td>
        <td className="td center">
          {locked ? (
            <span style={{ color: pd ? '#1c1917' : '#78716c' }}>
              {pd ? `${pd.home_goals}-${pd.away_goals}` : '—'}
            </span>
          ) : (
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center' }}>
              <input className="input" type="number" min={0} max={99} value={lh} onChange={e => setLh(e.target.value)} placeholder="—" />
              <span>-</span>
              <input className="input" type="number" min={0} max={99} value={la} onChange={e => setLa(e.target.value)} placeholder="—" />
              <button className="btn-primary btn-sm" onClick={() => { if (lh !== '' && la !== '') doSavePred(m.id, lh, la) }}>✓</button>
            </div>
          )}
        </td>
        <td className="td center">
          {pts !== null ? <span className={`pill pill-${ptColor}`}>{ptLabel}</span> : <span style={{ color: '#78716c' }}>—</span>}
        </td>
      </tr>
    )
  }

  // ── Admin result editor ──
  const ResEditor = ({ m }) => {
    const r = getR(m.id) || {}
    if (editId === m.id) return (
      <div className="res-editor">
        <input className="input" type="number" min={0} max={30} value={editH} onChange={e => setEditH(e.target.value)} autoFocus />
        <span>-</span>
        <input className="input" type="number" min={0} max={30} value={editA} onChange={e => setEditA(e.target.value)} />
        <button className="btn-primary btn-sm" onClick={() => { if (editH !== '' && editA !== '') doSaveResult(m.id, editH, editA) }}>OK</button>
        <button className="btn btn-sm" onClick={() => setEditId(null)}>✕</button>
      </div>
    )
    return (
      <button className="btn btn-sm" onClick={() => {
        setEditId(m.id); setEditH(r.home_goals != null ? String(r.home_goals) : ''); setEditA(r.away_goals != null ? String(r.away_goals) : '')
      }}>
        {hasRes(m.id) ? '✎ Editar' : '+ Resultado'}
      </button>
    )
  }

  // ── VIEWS ──

  const Ranking = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 17, fontWeight: 500 }}>Clasificación</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {!me && <button className="btn" onClick={() => openModal('login')}>Iniciar sesión</button>}
          <button className="btn-primary" onClick={() => openModal('join')}>+ Unirse</button>
        </div>
      </div>

      {me && (
        <div className="me-banner">
          <div>
            <span style={{ fontSize: 12, color: '#78716c' }}>Jugando como </span>
            <span style={{ fontWeight: 600, color: '#0f1f3d' }}>{me}</span>
            <span className="pill pill-p" style={{ marginLeft: 6, fontSize: 10 }}>
              #{ranking.findIndex(r => r.p === me) + 1}º · {playerPts(me)} pts
            </span>
          </div>
          <button className="btn btn-sm btn-danger" onClick={doLogout}>Cerrar sesión</button>
        </div>
      )}

      {players.length === 0 ? (
        <div className="card empty">
          <div className="empty-icon">⚽</div>
          <div className="empty-title">Nadie se ha apuntado todavía</div>
          <div style={{ marginBottom: 16 }}>Sé el primero en unirte al torneo</div>
          <button className="btn-primary" onClick={() => openModal('join')}>Unirse al torneo</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                {['', 'Jugador', 'Pts', 'Exactos', 'Bonus'].map((t, i) => (
                  <th key={t + i} className={`th${i >= 2 ? ' center' : ''}`}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => {
                const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}º`
                const bs = bonusSc[r.p] || {}
                const bT = (bs.champion_pts || 0) + (bs.runner_up_pts || 0) + (bs.scorer_pts || 0)
                const isMe2 = me === r.p
                return (
                  <tr key={r.p} className="rank-row"
                    style={{ background: isMe2 ? 'rgba(15,31,61,.05)' : i === 0 && r.pts > 0 ? 'rgba(245,158,11,.06)' : '' }}
                    onClick={() => { setView('preds') }}>
                    <td className="td" style={{ fontSize: 14 }}>{medal}</td>
                    <td className="td" style={{ fontWeight: isMe2 ? 600 : i < 3 ? 500 : 400 }}>
                      {r.p}
                      {isMe2 && <span style={{ marginLeft: 4, fontSize: 10, color: '#0f1f3d' }}>← tú</span>}
                      {admin && (
                        <button style={{ marginLeft: 6, border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 11 }}
                          onClick={e => {
                            e.stopPropagation()
                            if (window.confirm(`¿Eliminar a ${r.p}?`)) {
                              setUsers(prev => prev.filter(u => u.name !== r.p))
                              if (me === r.p) doLogout()
                            }
                          }}>✕</button>
                      )}
                    </td>
                    <td className="td center" style={{ fontWeight: 700, fontSize: 15, color: i === 0 && r.pts > 0 ? '#d97706' : '' }}>{r.pts}</td>
                    <td className="td center" style={{ color: '#78716c' }}>{r.ex}</td>
                    <td className="td center">{bT > 0 ? <span className="pill pill-b">+{bT}</span> : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div style={{ padding: '8px 12px', fontSize: 11, color: '#78716c' }}>Desempate: exactos → acertó campeón → reparto</div>
        </div>
      )}
    </div>
  )

  const Predictions = () => {
    const ms = ALL_MATCHES.filter(m => m.rd === round)
    if (!me) return (
      <div className="card empty" style={{ padding: '2rem' }}>
        <div style={{ fontSize: 13, marginBottom: 12, color: '#78716c' }}>Inicia sesión para poner tus pronósticos</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn" onClick={() => openModal('login')}>Iniciar sesión</button>
          <button className="btn-primary" onClick={() => openModal('join')}>+ Unirse</button>
        </div>
      </div>
    )
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 500, margin: 0 }}>Mis pronósticos</h2>
            <div style={{ fontSize: 12, color: '#78716c' }}>Como: <b>{me}</b></div>
          </div>
        </div>
        <div className="round-tabs">
          {ROUNDS.map(r => (
            <button key={r} className={`nav-btn${round === r ? ' active' : ''}`} onClick={() => setRound(r)}>{r}</button>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                {['Partido', 'Resultado', 'Mi pronóstico', 'Pts'].map((t, i) => (
                  <th key={t} className={`th${i > 0 ? ' center' : ''}`}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>{ms.map(m => <MatchRow key={m.id} m={m} />)}</tbody>
          </table>
        </div>
      </div>
    )
  }

  const AllMatches = () => {
    const ms = ALL_MATCHES.filter(m => m.rd === round)
    return (
      <div>
        <div className="round-tabs">
          {ROUNDS.map(r => (
            <button key={r} className={`nav-btn${round === r ? ' active' : ''}`} onClick={() => setRound(r)}>{r}</button>
          ))}
        </div>
        {ms.map(m => {
          const r = getR(m.id) || {}
          const played = hasRes(m.id), live = now >= m.dt && !played
          const hName = m.hLabel ? getTeam(m, 'h') : m.h
          const aName = m.hLabel ? getTeam(m, 'a') : m.a
          return (
            <div key={m.id} className="card" style={{ marginBottom: 8 }}>
              <div className="match-header">
                <div className="match-meta">
                  <span className="match-date">{fmtD(m.dt)} {fmtT(m.dt)}</span>
                  {m.gr && <span className="match-tag match-tag-gr">Gr.{m.gr}</span>}
                  {m.el && <span className="match-tag match-tag-elim">{m.rd}</span>}
                  {m.sp && <span className="match-tag match-tag-sp">×2</span>}
                </div>
                <div className="match-actions">
                  {played && <span className="pill pill-g">✓ Jugado</span>}
                  {live && <span className="pill pill-y" style={{ animation: 'pulse 1.5s infinite' }}>En juego</span>}
                  {admin && <ResEditor m={m} />}
                </div>
              </div>
              <div className="match-teams">
                {hName} <span style={{ color: '#78716c', fontWeight: 400, fontSize: 12 }}>vs</span> {aName}
                {played && <span className="match-score">{r.home_goals} — {r.away_goals}</span>}
              </div>
              {players.length > 0 && (
                <div className="match-preds">
                  {players.map(pl => {
                    const pd = preds[m.id]?.[pl]
                    const pts = played ? calcPts(pd?.home_goals, pd?.away_goals, r.home_goals, r.away_goals, m.sp, m.el) : null
                    const pc = pts === null ? '' : pts >= 3 ? 'g' : pts >= 1 ? 'y' : 'r'
                    const isMe2 = me === pl
                    return (
                      <div key={pl} className={`pred-chip${isMe2 ? ' me' : ''}`}>
                        <span className={`pred-name${isMe2 ? ' me' : ''}`}>{pl}</span>
                        <span style={{ fontSize: 12, color: pd ? '#1c1917' : '#78716c' }}>
                          {pd ? `${pd.home_goals}-${pd.away_goals}` : '—'}
                        </span>
                        {pts !== null && <span className={`pill pill-${pc}`} style={{ marginTop: 2 }}>{pts >= 6 ? `+${pts}⚡` : pts >= 3 ? '+3' : pts >= 1 ? '+1' : '0'}</span>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const Groups = () => {
    const gLetters = Object.keys(GROUP_TEAMS)
    const best3 = getBest3rds(results)
    return (
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 12 }}>Tablas de grupo</h2>
        <div className="groups-grid">
          {gLetters.map(g => {
            const table = calcGroupTable(g, results)
            return (
              <div key={g} className="group-card">
                <div className="group-title">
                  Grupo {g}
                  <span className="group-sub">{table[0]?.pj || 0}/3 jorn.</span>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      {['Equipo', 'Pj', 'Pts', 'DG', 'GF'].map((h, i) => (
                        <th key={h + i} className="th" style={{ fontSize: 10, padding: '4px 5px', textAlign: i > 0 ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((t, i) => (
                      <tr key={t.team} style={{ background: i < 2 ? 'rgba(16,185,129,.06)' : '' }}>
                        <td className="td" style={{ padding: '4px 5px', fontSize: 11 }}>
                          <span style={{ fontWeight: 600, color: i < 2 ? '#065f46' : '#78716c', marginRight: 3 }}>{i + 1}º</span>
                          {t.team}
                        </td>
                        <td className="td center" style={{ padding: '4px 5px' }}>{t.pj}</td>
                        <td className="td center" style={{ padding: '4px 5px', fontWeight: 600, color: i < 2 ? '#065f46' : '' }}>{t.pts}</td>
                        <td className="td center" style={{ padding: '4px 5px', color: t.gd > 0 ? '#065f46' : t.gd < 0 ? '#991b1b' : '#78716c' }}>
                          {t.gd > 0 ? `+${t.gd}` : t.gd}
                        </td>
                        <td className="td center" style={{ padding: '4px 5px' }}>{t.gf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
        {best3.length > 0 && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#78716c' }}>
              Mejores terceros clasificados
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {best3.map((t, i) => (
                <div key={t.team} className="card card-sm" style={{ marginBottom: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#d97706', minWidth: 18 }}>{i + 1}º</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{t.team}</div>
                    <div style={{ fontSize: 11, color: '#78716c' }}>Gr.{t.grp} · {t.pts} pts · DG {t.gd >= 0 ? '+' : ''}{t.gd}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const Bonus = () => {
    const bonusLocked = now >= BONUS_LOCK && !admin
    return (
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Bonus</h2>
        <p style={{ fontSize: 12, color: '#78716c', marginBottom: 12 }}>
          {bonusLocked ? 'Bonus bloqueados desde el inicio del torneo.' : 'Se bloquean al inicio del primer partido (11 jun 20:00h). El admin asigna puntos al final.'}
        </p>
        {players.length === 0 ? (
          <div className="card empty">Únete al torneo para rellenar tus bonus</div>
        ) : (
          <>
            <div className="card bonus-wrap" style={{ padding: 0 }}>
              <table className="table" style={{ minWidth: 460 }}>
                <thead>
                  <tr>
                    {['Jugador', 'Campeón (+10)', 'Subcampeón (+5)', 'Goleador (+5)', 'Pts'].map((t, i) => (
                      <th key={t} className={`th${i > 0 ? ' center' : ''}`}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map(pl => {
                    const b = bonus[pl] || {}
                    const bs = bonusSc[pl] || {}
                    const bT = (bs.champion_pts || 0) + (bs.runner_up_pts || 0) + (bs.scorer_pts || 0)
                    const isMe2 = me === pl
                    const canEdit = (isMe2 && !bonusLocked) || admin
                    const fields = [
                      { key: 'c', col: 'champion', ph: 'País campeón' },
                      { key: 's', col: 'runner_up', ph: 'País subcampeón' },
                      { key: 'g', col: 'top_scorer', ph: 'Jugador goleador' },
                    ]
                    const scFields = [
                      { key: 'c', scCol: 'champion_pts', opts: [0, 10] },
                      { key: 's', scCol: 'runner_up_pts', opts: [0, 5] },
                      { key: 'g', scCol: 'scorer_pts', opts: [0, 5] },
                    ]
                    return (
                      <tr key={pl} style={{ background: isMe2 ? 'rgba(15,31,61,.04)' : '' }}>
                        <td className="td" style={{ fontWeight: 500 }}>
                          {pl}{isMe2 && <span style={{ marginLeft: 4, fontSize: 10, color: '#0f1f3d' }}>← tú</span>}
                        </td>
                        {fields.map((f, fi) => (
                          <td key={f.key} className="td center">
                            {canEdit ? (
                              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <input
                                  className="input" style={{ width: 90, textAlign: 'left' }}
                                  value={b[f.col] || ''}
                                  onChange={async e => {
                                    setBonus(prev => ({ ...prev, [pl]: { ...(prev[pl] || {}), [f.col]: e.target.value } }))
                                    await saveBonus(pl, f.key, e.target.value)
                                  }}
                                  placeholder={f.ph}
                                />
                                {admin && (
                                  <select
                                    className="input" style={{ width: 52 }}
                                    value={bs[scFields[fi].scCol] || 0}
                                    onChange={async e => {
                                      const v = Number(e.target.value)
                                      setBonusSc(prev => ({ ...prev, [pl]: { ...(prev[pl] || {}), [scFields[fi].scCol]: v } }))
                                      await saveBonusScore(pl, f.key, v)
                                    }}>
                                    {scFields[fi].opts.map(v => <option key={v} value={v}>+{v}</option>)}
                                  </select>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: b[f.col] ? '#1c1917' : '#78716c' }}>{b[f.col] || '—'}</span>
                            )}
                          </td>
                        ))}
                        <td className="td center">
                          {bT > 0 ? <span className="pill pill-b">+{bT}</span> : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 500, marginTop: 14, marginBottom: 8 }}>Peor selección asignada</h3>
            <p style={{ fontSize: 11, color: '#78716c', marginBottom: 10 }}>3 goles en contra = +1 pto · 1 gol a favor = +1 pto</p>
            <div className="worst-grid">
              {players.map(pl => (
                <div key={pl} className="worst-card">
                  <div style={{ fontWeight: 500, fontSize: 12, marginBottom: 6 }}>{pl}</div>
                  {admin ? (
                    <select className="input-text" style={{ marginBottom: 0 }}
                      value={worstT[pl] || ''}
                      onChange={async e => {
                        setWorstT(prev => ({ ...prev, [pl]: e.target.value }))
                        await saveWorstTeam(pl, e.target.value)
                      }}>
                      <option value="">— Sin asignar —</option>
                      {WORST_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <div style={{ fontSize: 12, color: worstT[pl] ? '#1c1917' : '#78716c' }}>{worstT[pl] || 'Sin asignar'}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const Rules = () => (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 12 }}>Reglamento</h2>
      {[
        { t: 'Puntuación', items: ['🟢 Exacto: 3 pts', '🟡 Tendencia (ganador/empate): 1 pt', '🔴 Error: 0 pts', '⚡ España y rivales de grupo: ×2'] },
        { t: 'Eliminatorias', items: ['Cuenta resultado a 90 min + prórroga', 'No se pronostican empates en eliminatorias', 'Los penaltis cuentan para el marcador'] },
        { t: 'Bloqueo automático', items: ['Pronósticos se bloquean al inicio del partido', 'Bonus se bloquean al inicio del torneo (11 jun 20:00h)'] },
        { t: 'Bonus previos al Mundial', items: ['Campeón: +10 pts', 'Subcampeón: +5 pts', 'Máx. goleador: +5 pts'] },
        { t: 'Peor selección', items: ['3 goles en contra = +1 pto', '1 gol a favor = +1 pto'] },
        { t: 'Desempate', items: ['1º Más exactos', '2º Acertó el campeón', '3º Reparto del premio'] },
        { t: 'Premio (10€/persona)', items: ['1º: 60%', '2º: 25%', '3º: 15%'] },
      ].map(s => (
        <div key={s.t} className="card" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 500, marginBottom: 6, color: '#0f1f3d', fontSize: 13 }}>{s.t}</div>
          {s.items.map(item => <div key={item} style={{ fontSize: 12, marginBottom: 3, paddingLeft: 4 }}>{item}</div>)}
        </div>
      ))}
    </div>
  )

  // ── Modal helper ──
  const FieldRow = ({ label, value, onChange, type, placeholder }) => (
    <div style={{ marginBottom: 10 }}>
      <label className="field-label">{label}</label>
      <input
        type={type || 'text'}
        value={value}
        onChange={e => onChange(type === 'text' ? e.target.value.toUpperCase() : e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { if (modal === 'join') doJoin(); else if (modal === 'login') doLogin(); else if (modal === 'admin') doAdmin() } }}
        className="input-text"
        placeholder={placeholder || ''}
        autoComplete="off"
      />
    </div>
  )

  const NAVS = [
    { id: 'ranking', l: '🏆 Ranking' },
    { id: 'preds', l: '🎯 Pronósticos' },
    { id: 'all', l: '📊 Partidos' },
    { id: 'groups', l: '📋 Grupos' },
    { id: 'bonus', l: '⭐ Bonus' },
    { id: 'rules', l: '📖 Reglamento' },
  ]

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Cargando Panas World Cup...
    </div>
  )

  return (
    <>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>⚽</span>
          <div>
            <div className="header-title">PANAS WORLD CUP</div>
            <div className="header-sub">Copa del Mundo 2026</div>
          </div>
        </div>
        <div className="header-actions">
          {me && <span className="header-user">👤 {me}</span>}
          {admin && <span className="badge-admin">ADMIN</span>}
          {!admin && <button className="btn-header" onClick={() => openModal('admin')}>Admin</button>}
          {admin && <button className="btn-header" onClick={() => { setAdmin(false); toast2('Modo admin desactivado') }}>Salir admin</button>}
          {!me && <button className="btn-header primary" onClick={() => openModal('join')}>+ Unirse</button>}
        </div>
      </div>

      <nav className="nav">
        {NAVS.map(n => (
          <button key={n.id} className={`nav-btn${view === n.id ? ' active' : ''}`} onClick={() => setView(n.id)}>{n.l}</button>
        ))}
      </nav>

      <main className="main">
        {view === 'ranking' && <Ranking />}
        {view === 'preds' && <Predictions />}
        {view === 'all' && <AllMatches />}
        {view === 'groups' && <Groups />}
        {view === 'bonus' && <Bonus />}
        {view === 'rules' && <Rules />}
      </main>

      {/* Modals */}
      {modal === 'join' && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title">Unirse a la Panas WC 👋</div>
            <div className="modal-sub">Elige nombre y contraseña. Nadie podrá suplantar tu identidad.</div>
            <FieldRow label="Tu nombre" value={mName} onChange={setMName} type="text" placeholder="NOMBRE..." />
            <FieldRow label="Contraseña" value={mPass} onChange={setMPass} type="password" placeholder="Mínimo 4 caracteres" />
            <FieldRow label="Repite la contraseña" value={mPass2} onChange={setMPass2} type="password" placeholder="Repite la contraseña" />
            <div className="modal-row">
              <button className="btn" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={doJoin}>¡Unirme!</button>
            </div>
            {mErr && <div className="modal-error">{mErr}</div>}
          </div>
        </div>
      )}

      {modal === 'login' && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title">Iniciar sesión 🔑</div>
            <FieldRow label="Tu nombre" value={mName} onChange={setMName} type="text" placeholder="TU NOMBRE..." />
            <FieldRow label="Contraseña" value={mPass} onChange={setMPass} type="password" placeholder="Tu contraseña" />
            <div className="modal-row">
              <button className="btn" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={doLogin}>Entrar</button>
            </div>
            {mErr && <div className="modal-error">{mErr}</div>}
            <div className="modal-link">
              ¿Sin cuenta? <span onClick={() => openModal('join')}>Únete aquí</span>
            </div>
          </div>
        </div>
      )}

      {modal === 'admin' && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title">Acceso admin 🔐</div>
            <FieldRow label="Contraseña" value={mPass} onChange={setMPass} type="password" placeholder="Contraseña..." />
            <div className="modal-row">
              <button className="btn" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={doAdmin}>Entrar</button>
            </div>
            {mErr && <div className="modal-error">{mErr}</div>}
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.err ? 'err' : 'ok'}`}>{toast.msg}</div>}
    </>
  )
}
