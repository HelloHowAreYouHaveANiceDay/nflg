# -*- coding: utf-8 -*-

import pandas as pd
import seaborn as sns


play_players = pd.read_csv('./datasets/byGame_byPlayer_16_18.csv')






#df = df.fillna(0)

#df['combo_week'] = df.apply(lambda r: r.season_type + ' ' + str(r.week), axis = 1)

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

#df['fpts'] = df.apply(convert_fpts, axis=1)
#
#df['is_sk'] = df['position'].apply(is_skill_pos);
#
#players = df[df['is_sk'] == True]

play_players = play_players.loc[play_players['year'] == 2018]

play_players = play_players.loc[play_players['season_type'] == 'REG']

play_players = play_players.fillna(0)

play_players['fpts'] = play_players.apply(convert_fpts, axis=1)

play_players['ADOT'] = play_players['receiving_yds'] - play_players['receiving_yac']

play_players['is_sk'] = play_players['position'].apply(is_skill_pos);

plp = play_players[play_players['is_sk'] == True]

def totalPoints(row):
    return plp.loc[plp['player_id'] == row['player_id']]['fpts'].sum()

plp['total_points'] = plp.apply(totalPoints, axis = 1)


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

plp = plp.loc[plp['total_points'] >= 100]


g = sns.FacetGrid(plp, col='week', hue='position', col_wrap=4, height=4)
g = g.map(sns.kdeplot, 'fpts', shade=True)
g.add_legend()

