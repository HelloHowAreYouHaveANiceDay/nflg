# -*- coding: utf-8 -*-
"""
Created on Tue Aug 20 08:34:31 2019

@author: Libo
"""

# -*- coding: utf-8 -*-

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

play_players = pd.read_csv('./datasets/byGame_byPlayer_16_18.csv')

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

play_players['fpts'] = play_players.apply(convert_fpts, axis=1)

play_players = play_players.loc[play_players['season_type'] == 'REG']

play_players = play_players.fillna(0)

play_players['fpts'] = play_players.apply(convert_fpts, axis=1)

play_players['receiving_dot'] = play_players['receiving_yds'] - play_players['receiving_yac']


rbs = play_players.loc[play_players['position'] == 'RB']

def totalPoints(row):
    return rbs.loc[rbs['player_id'] == row['player_id']]['fpts'].sum()

rbs['total_points'] = rbs.apply(totalPoints, axis = 1)


#def rankPositions(df):
#    qbs = df.loc[df.position == 'QB'];
#    rbs = df.loc[df.position == 'RB'];
#    tes = df.loc[df.position == 'WR'];
#    wrs = df.loc[df.position == 'TE'];
#    qbs['pos_rank'] = qbs['fpts'].rank(method='min', ascending=False);
#    rbs['pos_rank'] = rbs['fpts'].rank(method='min', ascending=False);
#    wrs['pos_rank'] = wrs['fpts'].rank(method='min', ascending=False);
#    tes['pos_rank'] = tes['fpts'].rank(method='min', ascending=False);
#    return pd.concat([qbs, rbs, wrs, tes])
#
#ranked_plp = rankPositions(plp)

rbs = rbs.loc[rbs['total_points'] >= 100]

g = sns.PairGrid(rbs, x_vars=['receiving_tar', 'receiving_tar','receiving_yds',
                              'rushing_att', 'rushing_yds', 'fpts', 'total_points'], 
    y_vars=['receiving_tar', 'receiving_tar','receiving_yds',
                              'rushing_att', 'rushing_yds', 'fpts', 'total_points'])
g = g.map(plt.scatter)