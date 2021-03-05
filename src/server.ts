const express = require('express');
const cors = require('cors');
import riotApi from './services/riot-api';
import ddragon from './services/ddragon';
import api from './services/api';

interface invocador{
  name: String;
  id: String;
  accountId: String;
  summonerLevel: String;
  masteryScore: String;
  matchList: any
}

const app = express(); 
const KEY = '';

app.use(cors());
app.use(express.json());

app.get('/champions/:champion', async function(req: Request, res: Response){
  const championId = req.params.champion;
  try{ 
    const championList = await ddragon.get('/champion.json');
    //console.log(championList.data)
    const championData = championList.data.data;
    for( var i in championData ){
      if(championData[i].key==championId)
      res.send(championData[i]);
    }
  }catch(error){console.log(error);
  }
});

app.get('/:summoner',async function (req: Request, res: Response){
    const summoner = req.params.summoner;
    let userInfo: invocador = {
      name: '',
      id: '',
      accountId: '',
      summonerLevel: '',
      masteryScore: '',
      matchList: [{}]
    };
    try{
      const responseSummoner = await riotApi.get(
        `summoner/v4/summoners/by-name/${summoner}`, 
        { params:{ api_key: KEY } });
      userInfo.name = summoner;
      userInfo.id = responseSummoner.data.id;
      userInfo.accountId = responseSummoner.data.accountId;
      userInfo.summonerLevel = responseSummoner.data.summonerLevel;
    
      const responseMasteryScore = await riotApi.get(
        `champion-mastery/v4/scores/by-summoner/${responseSummoner.data.id}`,
        { params:{ api_key: KEY } });
      userInfo.masteryScore = responseMasteryScore.data;
    
      const responseMatchList = await riotApi.get(
        `match/v4/matchlists/by-account/${userInfo.accountId}`,
        { params: 
          { 
            api_key: KEY,
            endIndex: 4
          } 
        }
      );
      const getData = async () => {
        return Promise.all(responseMatchList.data.matches.map(async (match)=>{
          const champion = await api.get(`champions/${match.champion}`)
          const game = await riotApi.get(
            `match/v4/matches/${match.gameId}`,
            { params:
              {
                api_key: KEY,
              }
            }
          );
          const [player] = game.data.participantIdentities.filter((participant)=>(
            participant.player.accountId == userInfo.accountId
          ))
          const participants = game.data.participants
          const [participant] = game.data.participants.filter((part)=>(
            part.participantId == player.participantId
          ))
          const win = participant.stats.win
          return(
            {
              championCode: match.champion,
              lane: match.lane,
              queue: match.queue,
              gameId: match.gameId,
              championId: champion.data.id,
              championName: champion.data.name,
              gameMode: game.data.gameMode,
              player: player,
              //participant: participant,
              win: win
            }
          )
        }))
        }
        getData().then(
          data=>{
            userInfo.matchList=data;
            res.send(userInfo);
          }
        )
        //userInfo.matchList = responseMatchList.data.matches;

    
    }catch(error){
      return console.log(error);
    }
  }
);

  
app.listen(3333);
