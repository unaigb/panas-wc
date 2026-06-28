// Convierte serial de Excel a Date en hora Madrid (UTC+2)
function toDate(serial, tf) {
  return new Date((serial - 25569) * 86400000 + tf * 86400000 - 2 * 3600000)
}

export const GROUP_TEAMS = {
  A: ['México 🇲🇽', 'Corea del Sur 🇰🇷', 'R. Checa 🇨🇿', 'Sudáfrica 🇿🇦'],
  B: ['Canadá 🇨🇦', 'Bosnia 🇧🇦', 'Catar 🇶🇦', 'Suiza 🇨🇭'],
  C: ['Brasil 🇧🇷', 'Marruecos 🇲🇦', 'Haití 🇭🇹', 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
  D: ['EEUU 🇺🇸', 'Paraguay 🇵🇾', 'Australia 🇦🇺', 'Turquía 🇹🇷'],
  E: ['Alemania 🇩🇪', 'Curazao 🇨🇼', 'C. Marfil 🇨🇮', 'Ecuador 🇪🇨'],
  F: ['P. Bajos 🇳🇱', 'Japón 🇯🇵', 'Suecia 🇸🇪', 'Túnez 🇹🇳'],
  G: ['Bélgica 🇧🇪', 'Egipto 🇪🇬', 'Irán 🇮🇷', 'N. Zelanda 🇳🇿'],
  H: ['España 🇪🇸', 'Cabo Verde 🇨🇻', 'Arabia Saudí 🇸🇦', 'Uruguay 🇺🇾'],
  I: ['Francia 🇫🇷', 'Senegal 🇸🇳', 'Irak 🇮🇶', 'Noruega 🇳🇴'],
  J: ['Argentina 🇦🇷', 'Argelia 🇩🇿', 'Austria 🇦🇹', 'Jordania 🇯🇴'],
  K: ['Portugal 🇵🇹', 'RD Congo 🇨🇩', 'Uzbekistán 🇺🇿', 'Colombia 🇨🇴'],
  L: ['Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croacia 🇭🇷', 'Ghana 🇬🇭', 'Panamá 🇵🇦'],
}

export const WORST_TEAMS = [
  'Cabo Verde 🇨🇻', 'Curazao 🇨🇼', 'Haití 🇭🇹', 'Bosnia 🇧🇦',
  'Uzbekistán 🇺🇿', 'Jordania 🇯🇴', 'RD Congo 🇨🇩', 'N. Zelanda 🇳🇿',
  'Irak 🇮🇶', 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Panamá 🇵🇦', 'Argelia 🇩🇿',
  'Ghana 🇬🇭', 'Paraguay 🇵🇾',
]

export const GROUP_MATCHES = [
  { id: 1,  rd: 'Grupos J1', dt: toDate(46184, .875),   gr: 'A', h: 'México 🇲🇽',      a: 'Sudáfrica 🇿🇦',   sp: false },
  { id: 2,  rd: 'Grupos J1', dt: toDate(46185, .16667), gr: 'A', h: 'Corea del Sur 🇰🇷', a: 'R. Checa 🇨🇿',   sp: false },
  { id: 3,  rd: 'Grupos J1', dt: toDate(46185, .875),   gr: 'B', h: 'Canadá 🇨🇦',       a: 'Bosnia 🇧🇦',     sp: false },
  { id: 4,  rd: 'Grupos J1', dt: toDate(46186, .125),   gr: 'D', h: 'EEUU 🇺🇸',         a: 'Paraguay 🇵🇾',   sp: false },
  { id: 5,  rd: 'Grupos J1', dt: toDate(46186, .875),   gr: 'B', h: 'Catar 🇶🇦',        a: 'Suiza 🇨🇭',      sp: false },
  { id: 6,  rd: 'Grupos J1', dt: toDate(46187, .0),     gr: 'C', h: 'Brasil 🇧🇷',       a: 'Marruecos 🇲🇦',  sp: false },
  { id: 7,  rd: 'Grupos J1', dt: toDate(46187, .125),   gr: 'C', h: 'Haití 🇭🇹',        a: 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿',    sp: false },
  { id: 8,  rd: 'Grupos J1', dt: toDate(46187, .25),    gr: 'D', h: 'Australia 🇦🇺',    a: 'Turquía 🇹🇷',    sp: false },
  { id: 9,  rd: 'Grupos J1', dt: toDate(46187, .79167), gr: 'E', h: 'Alemania 🇩🇪',     a: 'Curazao 🇨🇼',    sp: false },
  { id: 10, rd: 'Grupos J1', dt: toDate(46187, .91667), gr: 'F', h: 'P. Bajos 🇳🇱',    a: 'Japón 🇯🇵',      sp: false },
  { id: 11, rd: 'Grupos J1', dt: toDate(46188, .04167), gr: 'E', h: 'C. Marfil 🇨🇮',   a: 'Ecuador 🇪🇨',    sp: false },
  { id: 12, rd: 'Grupos J1', dt: toDate(46188, .16667), gr: 'F', h: 'Suecia 🇸🇪',       a: 'Túnez 🇹🇳',      sp: false },
  { id: 13, rd: 'Grupos J1', dt: toDate(46188, .75),    gr: 'H', h: 'España 🇪🇸',       a: 'Cabo Verde 🇨🇻',  sp: true  },
  { id: 14, rd: 'Grupos J1', dt: toDate(46188, .875),   gr: 'G', h: 'Bélgica 🇧🇪',      a: 'Egipto 🇪🇬',     sp: false },
  { id: 15, rd: 'Grupos J1', dt: toDate(46189, .0),     gr: 'H', h: 'Arabia Saudí 🇸🇦', a: 'Uruguay 🇺🇾',    sp: true  },
  { id: 16, rd: 'Grupos J1', dt: toDate(46189, .125),   gr: 'G', h: 'Irán 🇮🇷',         a: 'N. Zelanda 🇳🇿', sp: false },
  { id: 17, rd: 'Grupos J1', dt: toDate(46189, .875),   gr: 'I', h: 'Francia 🇫🇷',      a: 'Senegal 🇸🇳',    sp: false },
  { id: 18, rd: 'Grupos J1', dt: toDate(46190, .0),     gr: 'I', h: 'Irak 🇮🇶',         a: 'Noruega 🇳🇴',    sp: false },
  { id: 19, rd: 'Grupos J1', dt: toDate(46190, .125),   gr: 'J', h: 'Argentina 🇦🇷',    a: 'Argelia 🇩🇿',    sp: false },
  { id: 20, rd: 'Grupos J1', dt: toDate(46190, .25),    gr: 'J', h: 'Austria 🇦🇹',      a: 'Jordania 🇯🇴',   sp: false },
  { id: 21, rd: 'Grupos J1', dt: toDate(46190, .79167), gr: 'K', h: 'Portugal 🇵🇹',     a: 'RD Congo 🇨🇩',   sp: false },
  { id: 22, rd: 'Grupos J1', dt: toDate(46190, .91667), gr: 'L', h: 'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿',  a: 'Croacia 🇭🇷',    sp: false },
  { id: 23, rd: 'Grupos J1', dt: toDate(46191, .04167), gr: 'L', h: 'Ghana 🇬🇭',        a: 'Panamá 🇵🇦',     sp: false },
  { id: 24, rd: 'Grupos J1', dt: toDate(46191, .16667), gr: 'K', h: 'Uzbekistán 🇺🇿',   a: 'Colombia 🇨🇴',   sp: false },
  { id: 25, rd: 'Grupos J2', dt: toDate(46191, .75),    gr: 'A', h: 'R. Checa 🇨🇿',    a: 'Sudáfrica 🇿🇦',  sp: false },
  { id: 26, rd: 'Grupos J2', dt: toDate(46191, .875),   gr: 'B', h: 'Suiza 🇨🇭',        a: 'Bosnia 🇧🇦',     sp: false },
  { id: 27, rd: 'Grupos J2', dt: toDate(46192, .0),     gr: 'B', h: 'Canadá 🇨🇦',       a: 'Catar 🇶🇦',      sp: false },
  { id: 28, rd: 'Grupos J2', dt: toDate(46192, .125),   gr: 'A', h: 'México 🇲🇽',       a: 'Corea del Sur 🇰🇷', sp: false },
  { id: 29, rd: 'Grupos J2', dt: toDate(46192, .875),   gr: 'D', h: 'EEUU 🇺🇸',         a: 'Australia 🇦🇺',  sp: false },
  { id: 30, rd: 'Grupos J2', dt: toDate(46193, .0),     gr: 'C', h: 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿',    a: 'Marruecos 🇲🇦',  sp: false },
  { id: 31, rd: 'Grupos J2', dt: toDate(46193, .10417), gr: 'C', h: 'Brasil 🇧🇷',       a: 'Haití 🇭🇹',      sp: false },
  { id: 32, rd: 'Grupos J2', dt: toDate(46193, .20833), gr: 'D', h: 'Turquía 🇹🇷',      a: 'Paraguay 🇵🇾',   sp: false },
  { id: 33, rd: 'Grupos J2', dt: toDate(46193, .79167), gr: 'F', h: 'P. Bajos 🇳🇱',    a: 'Suecia 🇸🇪',      sp: false },
  { id: 34, rd: 'Grupos J2', dt: toDate(46193, .91667), gr: 'E', h: 'Alemania 🇩🇪',     a: 'C. Marfil 🇨🇮',  sp: false },
  { id: 35, rd: 'Grupos J2', dt: toDate(46194, .08333), gr: 'E', h: 'Ecuador 🇪🇨',      a: 'Curazao 🇨🇼',    sp: false },
  { id: 36, rd: 'Grupos J2', dt: toDate(46194, .25),    gr: 'F', h: 'Túnez 🇹🇳',        a: 'Japón 🇯🇵',      sp: false },
  { id: 37, rd: 'Grupos J2', dt: toDate(46194, .75),    gr: 'H', h: 'España 🇪🇸',       a: 'Arabia Saudí 🇸🇦', sp: true },
  { id: 38, rd: 'Grupos J2', dt: toDate(46194, .875),   gr: 'G', h: 'Bélgica 🇧🇪',      a: 'Irán 🇮🇷',       sp: false },
  { id: 39, rd: 'Grupos J2', dt: toDate(46195, .0),     gr: 'H', h: 'Uruguay 🇺🇾',      a: 'Cabo Verde 🇨🇻',  sp: true  },
  { id: 40, rd: 'Grupos J2', dt: toDate(46195, .125),   gr: 'G', h: 'N. Zelanda 🇳🇿',  a: 'Egipto 🇪🇬',      sp: false },
  { id: 41, rd: 'Grupos J2', dt: toDate(46195, .79167), gr: 'J', h: 'Argentina 🇦🇷',    a: 'Austria 🇦🇹',    sp: false },
  { id: 42, rd: 'Grupos J2', dt: toDate(46195, .95833), gr: 'I', h: 'Francia 🇫🇷',      a: 'Irak 🇮🇶',       sp: false },
  { id: 43, rd: 'Grupos J2', dt: toDate(46196, .08333), gr: 'I', h: 'Noruega 🇳🇴',      a: 'Senegal 🇸🇳',    sp: false },
  { id: 44, rd: 'Grupos J2', dt: toDate(46196, .20833), gr: 'J', h: 'Jordania 🇯🇴',     a: 'Argelia 🇩🇿',    sp: false },
  { id: 45, rd: 'Grupos J2', dt: toDate(46196, .79167), gr: 'K', h: 'Portugal 🇵🇹',     a: 'Uzbekistán 🇺🇿', sp: false },
  { id: 46, rd: 'Grupos J2', dt: toDate(46196, .91667), gr: 'L', h: 'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿',  a: 'Ghana 🇬🇭',      sp: false },
  { id: 47, rd: 'Grupos J2', dt: toDate(46197, .04167), gr: 'L', h: 'Panamá 🇵🇦',       a: 'Croacia 🇭🇷',    sp: false },
  { id: 48, rd: 'Grupos J2', dt: toDate(46197, .16667), gr: 'K', h: 'Colombia 🇨🇴',     a: 'RD Congo 🇨🇩',   sp: false },
  { id: 49, rd: 'Grupos J3', dt: toDate(46197, .875),   gr: 'B', h: 'Suiza 🇨🇭',        a: 'Canadá 🇨🇦',     sp: false },
  { id: 50, rd: 'Grupos J3', dt: toDate(46197, .875),   gr: 'B', h: 'Bosnia 🇧🇦',       a: 'Catar 🇶🇦',      sp: false },
  { id: 51, rd: 'Grupos J3', dt: toDate(46198, .0),     gr: 'C', h: 'Marruecos 🇲🇦',    a: 'Haití 🇭🇹',      sp: false },
  { id: 52, rd: 'Grupos J3', dt: toDate(46198, .0),     gr: 'C', h: 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿',    a: 'Brasil 🇧🇷',     sp: false },
  { id: 53, rd: 'Grupos J3', dt: toDate(46198, .125),   gr: 'A', h: 'Sudáfrica 🇿🇦',    a: 'Corea del Sur 🇰🇷', sp: false },
  { id: 54, rd: 'Grupos J3', dt: toDate(46198, .125),   gr: 'A', h: 'R. Checa 🇨🇿',    a: 'México 🇲🇽',      sp: false },
  { id: 55, rd: 'Grupos J3', dt: toDate(46198, .91667), gr: 'E', h: 'Curazao 🇨🇼',      a: 'C. Marfil 🇨🇮',  sp: false },
  { id: 56, rd: 'Grupos J3', dt: toDate(46198, .91667), gr: 'E', h: 'Ecuador 🇪🇨',      a: 'Alemania 🇩🇪',   sp: false },
  { id: 57, rd: 'Grupos J3', dt: toDate(46199, .04167), gr: 'F', h: 'Japón 🇯🇵',        a: 'Suecia 🇸🇪',      sp: false },
  { id: 58, rd: 'Grupos J3', dt: toDate(46199, .04167), gr: 'F', h: 'Túnez 🇹🇳',        a: 'P. Bajos 🇳🇱',   sp: false },
  { id: 59, rd: 'Grupos J3', dt: toDate(46199, .16667), gr: 'D', h: 'Turquía 🇹🇷',      a: 'EEUU 🇺🇸',       sp: false },
  { id: 60, rd: 'Grupos J3', dt: toDate(46199, .16667), gr: 'D', h: 'Paraguay 🇵🇾',     a: 'Australia 🇦🇺',  sp: false },
  { id: 61, rd: 'Grupos J3', dt: toDate(46199, .875),   gr: 'I', h: 'Noruega 🇳🇴',      a: 'Francia 🇫🇷',    sp: false },
  { id: 62, rd: 'Grupos J3', dt: toDate(46199, .875),   gr: 'I', h: 'Senegal 🇸🇳',      a: 'Irak 🇮🇶',       sp: false },
  { id: 63, rd: 'Grupos J3', dt: toDate(46200, .08333), gr: 'H', h: 'Cabo Verde 🇨🇻',   a: 'Arabia Saudí 🇸🇦', sp: true },
  { id: 64, rd: 'Grupos J3', dt: toDate(46200, .08333), gr: 'H', h: 'Uruguay 🇺🇾',      a: 'España 🇪🇸',     sp: true  },
  { id: 65, rd: 'Grupos J3', dt: toDate(46200, .20833), gr: 'G', h: 'Egipto 🇪🇬',       a: 'Irán 🇮🇷',       sp: false },
  { id: 66, rd: 'Grupos J3', dt: toDate(46200, .20833), gr: 'G', h: 'N. Zelanda 🇳🇿',  a: 'Bélgica 🇧🇪',    sp: false },
  { id: 67, rd: 'Grupos J3', dt: toDate(46200, .95833), gr: 'L', h: 'Panamá 🇵🇦',       a: 'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿', sp: false },
  { id: 68, rd: 'Grupos J3', dt: toDate(46200, .95833), gr: 'L', h: 'Croacia 🇭🇷',      a: 'Ghana 🇬🇭',      sp: false },
  { id: 69, rd: 'Grupos J3', dt: toDate(46201, .0625),  gr: 'K', h: 'Colombia 🇨🇴',     a: 'Portugal 🇵🇹',   sp: false },
  { id: 70, rd: 'Grupos J3', dt: toDate(46201, .0625),  gr: 'K', h: 'RD Congo 🇨🇩',     a: 'Uzbekistán 🇺🇿', sp: false },
  { id: 71, rd: 'Grupos J3', dt: toDate(46201, .16667), gr: 'J', h: 'Argelia 🇩🇿',      a: 'Austria 🇦🇹',    sp: false },
  { id: 72, rd: 'Grupos J3', dt: toDate(46201, .16667), gr: 'J', h: 'Jordania 🇯🇴',     a: 'Argentina 🇦🇷',  sp: false },
]

// Eliminatorias con cruces REALES definidos tras la fase de grupos
// Dieciseisavos: equipos fijos. Octavos en adelante: ganadores de partidos anteriores
export const ELIM_MATCHES = [
  // ── Dieciseisavos (todos -1h respecto a lo que teníamos) ──
  { id: 73,  rd: 'Dieciseavos', dt: new Date('2026-06-28T21:00:00+02:00'), h: 'Sudáfrica 🇿🇦',    a: 'Canadá 🇨🇦',        el: true },
  { id: 74,  rd: 'Dieciseavos', dt: new Date('2026-06-29T19:00:00+02:00'), h: 'Brasil 🇧🇷',       a: 'Japón 🇯🇵',         el: true },
  { id: 75,  rd: 'Dieciseavos', dt: new Date('2026-06-29T22:30:00+02:00'), h: 'Alemania 🇩🇪',     a: 'Paraguay 🇵🇾',      el: true },
  { id: 76,  rd: 'Dieciseavos', dt: new Date('2026-06-30T03:00:00+02:00'), h: 'P. Bajos 🇳🇱',    a: 'Marruecos 🇲🇦',     el: true },
  { id: 77,  rd: 'Dieciseavos', dt: new Date('2026-06-30T19:00:00+02:00'), h: 'C. Marfil 🇨🇮',   a: 'Noruega 🇳🇴',       el: true },
  { id: 78,  rd: 'Dieciseavos', dt: new Date('2026-06-30T23:00:00+02:00'), h: 'Francia 🇫🇷',      a: 'Suecia 🇸🇪',        el: true },
  { id: 79,  rd: 'Dieciseavos', dt: new Date('2026-07-01T03:00:00+02:00'), h: 'México 🇲🇽',       a: 'Ecuador 🇪🇨',       el: true },
  { id: 80,  rd: 'Dieciseavos', dt: new Date('2026-07-01T18:00:00+02:00'), h: 'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿',  a: 'RD Congo 🇨🇩',      el: true },
  { id: 81,  rd: 'Dieciseavos', dt: new Date('2026-07-01T22:00:00+02:00'), h: 'Bélgica 🇧🇪',      a: 'Senegal 🇸🇳',       el: true },
  { id: 82,  rd: 'Dieciseavos', dt: new Date('2026-07-02T02:00:00+02:00'), h: 'EEUU 🇺🇸',         a: 'Bosnia 🇧🇦',        el: true },
  { id: 83,  rd: 'Dieciseavos', dt: new Date('2026-07-02T21:00:00+02:00'), h: 'España 🇪🇸',       a: 'Austria 🇦🇹',       el: true, sp: true },
  { id: 84,  rd: 'Dieciseavos', dt: new Date('2026-07-03T01:00:00+02:00'), h: 'Portugal 🇵🇹',     a: 'Croacia 🇭🇷',       el: true },
  { id: 85,  rd: 'Dieciseavos', dt: new Date('2026-07-03T06:00:00+02:00'), h: 'Suiza 🇨🇭',        a: 'Argelia 🇩🇿',       el: true },
  { id: 86,  rd: 'Dieciseavos', dt: new Date('2026-07-03T20:00:00+02:00'), h: 'Australia 🇦🇺',    a: 'Egipto 🇪🇬',        el: true },
  { id: 87,  rd: 'Dieciseavos', dt: new Date('2026-07-04T00:00:00+02:00'), h: 'Argentina 🇦🇷',    a: 'Cabo Verde 🇨🇻',    el: true },
  { id: 88,  rd: 'Dieciseavos', dt: new Date('2026-07-04T03:30:00+02:00'), h: 'Colombia 🇨🇴',     a: 'Ghana 🇬🇭',         el: true },
  // ── Octavos (todos -3h respecto a lo que teníamos) ──
  { id: 89,  rd: 'Octavos',     dt: new Date('2026-07-04T19:00:00+02:00'), hLabel: 'G P74', aLabel: 'G P77', el: true },
  { id: 90,  rd: 'Octavos',     dt: new Date('2026-07-04T23:00:00+02:00'), hLabel: 'G P73', aLabel: 'G P75', el: true },
  { id: 91,  rd: 'Octavos',     dt: new Date('2026-07-05T19:00:00+02:00'), hLabel: 'G P76', aLabel: 'G P78', el: true },
  { id: 92,  rd: 'Octavos',     dt: new Date('2026-07-05T23:00:00+02:00'), hLabel: 'G P79', aLabel: 'G P80', el: true },
  { id: 93,  rd: 'Octavos',     dt: new Date('2026-07-06T19:00:00+02:00'), hLabel: 'G P83', aLabel: 'G P84', el: true },
  { id: 94,  rd: 'Octavos',     dt: new Date('2026-07-06T23:00:00+02:00'), hLabel: 'G P81', aLabel: 'G P82', el: true },
  { id: 95,  rd: 'Octavos',     dt: new Date('2026-07-07T19:00:00+02:00'), hLabel: 'G P86', aLabel: 'G P88', el: true },
  { id: 96,  rd: 'Octavos',     dt: new Date('2026-07-07T23:00:00+02:00'), hLabel: 'G P85', aLabel: 'G P87', el: true },
  // ── Cuartos ──
  { id: 97,  rd: 'Cuartos',     dt: new Date('2026-07-09T22:00:00+02:00'), hLabel: 'G P89', aLabel: 'G P90', el: true },  // día 9: bien
  { id: 98,  rd: 'Cuartos',     dt: new Date('2026-07-10T21:00:00+02:00'), hLabel: 'G P93', aLabel: 'G P94', el: true },  // día 10: -1h
  { id: 99,  rd: 'Cuartos',     dt: new Date('2026-07-11T23:00:00+02:00'), hLabel: 'G P91', aLabel: 'G P92', el: true },  // día 11: +1h
  { id: 100, rd: 'Cuartos',     dt: new Date('2026-07-12T03:00:00+02:00'), hLabel: 'G P95', aLabel: 'G P96', el: true },  // día 12: +1h
  // ── Semis (-1h) ──
  { id: 101, rd: 'Semis',       dt: new Date('2026-07-14T21:00:00+02:00'), hLabel: 'G P97',  aLabel: 'G P98',  el: true },
  { id: 102, rd: 'Semis',       dt: new Date('2026-07-15T21:00:00+02:00'), hLabel: 'G P99',  aLabel: 'G P100', el: true },
  // ── Final ──
  { id: 103, rd: '3er Puesto',  dt: new Date('2026-07-18T23:00:00+02:00'), hLabel: 'P P101', aLabel: 'P P102', el: true },  // +1h
  { id: 104, rd: 'Final 🏆',    dt: new Date('2026-07-19T21:00:00+02:00'), hLabel: 'G P101', aLabel: 'G P102', el: true },  // -1h
]

export const ALL_MATCHES = [...GROUP_MATCHES, ...ELIM_MATCHES]
export const ROUNDS = [...new Set(ALL_MATCHES.map(m => m.rd))]
