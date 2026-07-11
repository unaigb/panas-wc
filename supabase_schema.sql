-- =====================================================
-- PANAS WORLD CUP 2026 — Schema para Supabase
-- Ejecuta esto en: supabase.com → SQL Editor → New query
-- =====================================================

-- Usuarios del torneo
create table if not exists pwc_users (
  name text primary key,
  pass_hash text not null,
  created_at timestamptz default now()
);

-- Resultados reales de partidos (los pone el admin)
create table if not exists pwc_results (
  match_id integer primary key,
  home_goals integer not null,
  away_goals integer not null,
  updated_at timestamptz default now()
);

-- Pronósticos de cada jugador
create table if not exists pwc_predictions (
  match_id integer not null,
  player_name text not null,
  home_goals integer not null,
  away_goals integer not null,
  penalty_winner text,
  updated_at timestamptz default now(),
  primary key (match_id, player_name)
);

-- Apuestas bonus (campeón, subcampeón, goleador)
create table if not exists pwc_bonus (
  player_name text primary key,
  champion text,
  runner_up text,
  top_scorer text,
  updated_at timestamptz default now()
);

-- Puntuación bonus asignada por el admin
create table if not exists pwc_bonus_scores (
  player_name text primary key,
  champion_pts integer default 0,
  runner_up_pts integer default 0,
  scorer_pts integer default 0,
  updated_at timestamptz default now()
);

-- Peor selección asignada a cada jugador
create table if not exists pwc_worst_teams (
  player_name text primary key,
  team_name text,
  updated_at timestamptz default now()
);

-- =====================================================
-- Permisos: acceso público (anon) para leer y escribir
-- La seguridad real la gestiona la app (contraseñas hasheadas)
-- =====================================================
alter table pwc_users enable row level security;
alter table pwc_results enable row level security;
alter table pwc_predictions enable row level security;
alter table pwc_bonus enable row level security;
alter table pwc_bonus_scores enable row level security;
alter table pwc_worst_teams enable row level security;

create policy "public read users" on pwc_users for select using (true);
create policy "public insert users" on pwc_users for insert with check (true);
create policy "public read results" on pwc_results for select using (true);
create policy "public write results" on pwc_results for all using (true);
create policy "public read predictions" on pwc_predictions for select using (true);
create policy "public write predictions" on pwc_predictions for all using (true);
create policy "public read bonus" on pwc_bonus for select using (true);
create policy "public write bonus" on pwc_bonus for all using (true);
create policy "public read bonus scores" on pwc_bonus_scores for select using (true);
create policy "public write bonus scores" on pwc_bonus_scores for all using (true);
create policy "public read worst teams" on pwc_worst_teams for select using (true);
create policy "public write worst teams" on pwc_worst_teams for all using (true);
