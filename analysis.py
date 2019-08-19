# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import pandas as pd
from os import path
import sqlite3
import seaborn as sns

DB_DIR = 'C:/working/nflg/'

conn = sqlite3.connect(path.join(DB_DIR, 'nfldb.db'))

df = pd.read_sql('''
    select player.full_name,
    player.position,
    player.player_id,
    game.game_id,
    game.home_team_id,
    game.away_team_id,
    game.year,
    game.week,
    game.weekday,
    game.season_type,
    SUM(play_player.receiving_yds) as receiving_yds,
    SUM(play_player.receiving_tar) as receiving_tar,
    SUM(play_player.receiving_rec) as receiving_rec,
    SUM(play_player.receiving_yac_yds) as receiving_yac,
    SUM(play_player.receiving_tds) as receiving_tds,
    SUM(play_player.receiving_twopta) as receiving_twopta,
    SUM(play_player.receiving_twoptm) as receiving_twoptm,
    SUM(play_player.receiving_twoptm) as receiving_twoptmissed,
    
    SUM(play_player.rushing_yds) as rushing_yds,
    SUM(play_player.rushing_loss_yds) as rushing_loss_yds,
    SUM(play_player.rushing_loss) as rushing_loss,
    SUM(play_player.rushing_twopta) as rushing_twopta,
    SUM(play_player.rushing_twoptm) as rushing_twoptm,
    SUM(play_player.rushing_twoptmissed) as rushing_twoptmiss,
    SUM(play_player.rushing_att) as rushing_att,
    SUM(play_player.rushing_tds) as rushing_tds,
    
    SUM(play_player.passing_att) as passing_att,
    sum(play_player.passing_cmp) as passing_cmp,
    SUM(play_player.passing_cmp_air_yds) as passing_cmp_air_yds,
    SUM(play_player.passing_incmp) as passing_incmp,
    sum(play_player.passing_int) as passing_int,
    SUM(play_player.passing_tds) as passing_tds,
    SUM(play_player.passing_twopta) as passing_twopta,
    SUM(play_player.passing_twoptm) as passing_twoptm,
    SUM(play_player.passing_twoptmissed) as passing_twoptmissed,
    SUM(play_player.passing_yds) as passing_yds,
    
    SUM(play_player.kicking_xpa) as kicking_xpa,
    SUM(play_player.kicking_xpmade) as kicking_xpmade,
    SUM(play_player.kicking_yds) as kicking_yds,
    
    
    sum(play_player.defense_ffum) as defense_ffum,
    sum(play_player.defense_int) as defense_int,
    sum(play_player.defense_safe) as defense_safe,
    sum(play_player.defense_frec_tds) as defense_frec_tds,
    sum(play_player.puntret_tds) as puntret_tds,
    
    sum(play_player.kickret_tds) as kickret_tds,
    sum(play_player.fumbles_rec_yds) as fumbles_rec_yds,
    sum(play_player.fumbles_rec_tds) as fumbles_rec_tds
    
    from play_player
    left join player
    on play_player.player_id = player.player_id
    left join game
    on play_player.game_id = game.game_id
        where game.year = 2018
    group by game.game_id, player.full_name

    ''', conn)

play_players = pd.read_sql('''
     select player.full_name,
    player.position,
    player.player_id,
    game.game_id,
    game.home_team_id,
    game.away_team_id,
    game.year,
    game.week,
    game.weekday,
    game.season_type,
    play.down,
    (play_player.receiving_yds) as receiving_yds,
    (play_player.receiving_tar) as receiving_tar,
    (play_player.receiving_rec) as receiving_rec,
    (play_player.receiving_yac_yds) as receiving_yac,
    (play_player.receiving_tds) as receiving_tds,
    (play_player.receiving_twopta) as receiving_twopta,
    (play_player.receiving_twoptm) as receiving_twoptm,
    (play_player.receiving_twoptm) as receiving_twoptmissed,
    
    
    (play_player.rushing_yds) as rushing_yds,
    (play_player.rushing_loss_yds) as rushing_loss_yds,
    (play_player.rushing_loss) as rushing_loss,
    (play_player.rushing_twopta) as rushing_twopta,
    (play_player.rushing_twoptm) as rushing_twoptm,
    (play_player.rushing_twoptmissed) as rushing_twoptmiss,
    (play_player.rushing_att) as rushing_att,
    (play_player.rushing_tds) as rushing_tds,
    
    (play_player.passing_att) as passing_att,
    (play_player.passing_cmp) as passing_cmp,
    (play_player.passing_cmp_air_yds) as passing_cmp_air_yds,
    (play_player.passing_incmp) as passing_incmp,
    (play_player.passing_int) as passing_int,
    (play_player.passing_tds) as passing_tds,
    (play_player.passing_twopta) as passing_twopta,
    (play_player.passing_twoptm) as passing_twoptm,
    (play_player.passing_twoptmissed) as passing_twoptmissed,
    (play_player.passing_yds) as passing_yds,
    
    (play_player.kicking_xpa) as kicking_xpa,
    (play_player.kicking_xpmade) as kicking_xpmade,
    (play_player.kicking_yds) as kicking_yds,
    
    
    (play_player.defense_ffum) as defense_ffum,
    (play_player.defense_int) as defense_int,
    (play_player.defense_safe) as defense_safe,
    (play_player.defense_frec_tds) as defense_frec_tds,
    (play_player.puntret_tds) as puntret_tds,
    
    (play_player.kickret_tds) as kickret_tds,
    (play_player.fumbles_rec_yds) as fumbles_rec_yds,
    (play_player.fumbles_rec_tds) as fumbles_rec_tds
    
    from play_player
    left join player
    on play_player.player_id = player.player_id
    left join game
    on play_player.game_id = game.game_id
    left join play
    on play.play_id = play_player.play_id and play.game_id = play_player.game_id

                           ''', conn)





df = df.fillna(0)

df['combo_week'] = df.apply(lambda r: r.season_type + ' ' + str(r.week), axis = 1)

def is_skill_pos(pos):
    return pos in ['RB', 'WR', 'TE', 'QB']

def convert_fpts(row):
    pt = 0
    # passing stats
    pt = pt + row.passing_yds*0.04
    pt = pt + row.passing_int*-2
    pt = pt + row.passing_tds* 4
    pt = pt + row.passing_twoptm*2
    
    # rushing
    pt = pt + row.rushing_yds*0.1
    pt = pt + row.rushing_tds*6
    pt = pt + row.rushing_twoptm*2
    
    #receiving
    pt = pt + row.receiving_yds*0.1
    pt = pt + row.receiving_rec*0.5
    pt = pt + row.receiving_tds*6
    pt = pt + row.receiving_twoptm*2
    
    return pt

df['fpts'] = df.apply(convert_fpts, axis=1)

df['is_sk'] = df['position'].apply(is_skill_pos);

players = df[df['is_sk'] == True]


play_players = play_players.fillna(0)

play_players['fpts'] = play_players.apply(convert_fpts, axis=1)

play_players['ADOT'] = play_players['receiving_yds'] - play_players['receiving_yac']

play_players['is_sk'] = play_players['position'].apply(is_skill_pos);

plp = play_players[play_players['is_sk'] == True]



rbs = players.loc[players['position'] == 'RB']
 
qbs = players.loc[players['position'] == 'QB']

wrs = players.loc[players['position'] == 'WR']

#g = sns.FacetGrid(rbs, hue='position', col='combo_week', col_wrap=4, height=6)
#g = g.map(sns.kdeplot, 'fpts', shade=True)
#g.add_legend()

playerNames = [
        # RBs
#        'Derrick Henry',
#        'Saquon Barkley',
#      'Ezekiel Elliott',
#        # QBs
#
#        'Nick Chubb',
        

        # WRs
        'Julio Jones',
        'Odell Beckham',
        'Michael Thomas',
        'Davante Adams',
        'Deandre Hopkins',
        'Tyreek Hill',
        'JuJu Smith-Shuster',
        'Antonio Brown',
        'Amari Cooper',
        'Adam Thielen',
        ]

def filterByName(df, name):
    return df.loc[df['full_name'] == name]





#dh = players.loc[players['full_name'] == 'Derrick Henry']
#kj = players.loc[players['full_name'] == 'Kerryon Johnson']
#cm =  players.loc[players['full_name'] == 'Tom Brady']
#sb =  players.loc[players['full_name'] == 'Saquon Barkley']
#ak =  players.loc[players['full_name'] == 'Alvin Kamara']
#da =  players.loc[players['full_name'] == 'Aaron Rodgers']
#jj =  players.loc[players['full_name'] == 'Kirk Cousins']
#ae = players.loc[players['full_name'] == 'Patrick Mahomes']

playersStats = [filterByName(plp, name) for name in playerNames]

pp = pd.concat(playersStats)
#
#g = sns.FacetGrid(pp, hue='full_name', height=12)
#g = g.map(sns.kdeplot, 'ADOT', shade=True)
#g.add_legend()

g = sns.FacetGrid(pp, col='down', hue='full_name', col_wrap=4, height=6)
g = g.map(sns.kdeplot, 'ADOT', shade=True)
g.add_legend()


#g = sns.lmplot(x='fpts', y='fpts', hue='position', height=5, data=rbs)