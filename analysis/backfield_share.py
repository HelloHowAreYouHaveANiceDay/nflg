# -*- coding: utf-8 -*-
"""
Created on Tue Sep 10 09:18:49 2019

@author: Libo
"""
import os
import sqlite3
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap

dirname = os.path.dirname(__file__)
db_path = os.path.join(dirname, '../nfldb.db')
conn = sqlite3.connect(db_path)

year = 2019
week = 2
s_type = "REG"
team = "PHI"


query = f"""select *
                 from play_player
                 left join game
                 on game.game_id = play_player.game_id
                 left join play
                 on play.play_id = play_player.play_id
                 and play_player.game_id = play.game_id
                 left join drive
                 on drive.drive_id = play_player.drive_id
                 and drive.game_id = play_player.game_id
                 where game.year = {year}
                 and game.week = {week}
                 and game.game_type = '{s_type}'
                 and play_player.team = '{team}'
                 """
                 
                
                 
df = pd.read_sql_query(query, conn)

df = df.fillna(0)

#rb_columns = ['receiving_tar', 'receiving_yds', 'receiving_tds',
#               'receiving_twopta', 'receiving_twoptm', 'receiving_twoptmissed',
#               'receiving_yac_yds']

id_columns = ['player_short', 'team']

game_columns = ['yards_to_go', 'start_qtr']


att_players = df[(df['rushing_att'] > 0 )| (df['receiving_tar'] > 0)]

atp = att_players[att_players['rushing_att'] > 0]['player_short'].unique()

att_players = att_players[att_players['player_short'].isin(atp)]

attempts = att_players[att_players['player_short'].isin(atp)]

attempts = att_players.groupby(['player_short', 'start_qtr'], as_index=False).agg({'rushing_att': 'sum'})

att_by_down = att_players.groupby(['player_short', 'down'], as_index=False).agg({'rushing_att': 'sum'})


#targeted_players['dot'] = targeted_players['receiving_yds'] - targeted_players['receiving_yac_yds']
sns.catplot(y="player_short", hue="start_qtr", x="rushing_att", kind="bar", data=attempts)

sns.catplot(y="player_short", hue="down", x="rushing_att", kind="bar", data=att_by_down)

#receiver_stats = targeted_players[id_columns + game_columns + rb_columns]
sns.catplot(y="player_short", x="rushing_yds", data=att_players, jitter=False, alpha=0.5)

sns.catplot(y="player_short", x="yardline", data=att_players, jitter=False, alpha=0.5)