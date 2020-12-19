const express = require('express');
const cors = require('cors');
import riotApi from './services/riot-api';

interface invocador{
  name: String;
  accountId: String;
  summonerLevel: String;
  masteryScore: String;
}

const app = express();
const KEY = 'RGAPI-d84e2a4a-492a-4452-b071-fc2250298522';

app.use(cors());
app.use(express.json());


app.get('/:summoner',async function (req,res){
    const summoner = req.params.summoner;
    let userInfo: invocador = {
      name: '',
      accountId: '',
      summonerLevel: '',
      masteryScore: ''
    };
    try{
      const responseSummoner = await riotApi.get(
        `summoner/v4/summoners/by-name/${summoner}`, 
        { params:{ api_key: KEY } });
      userInfo.name = summoner;
      userInfo.accountId = responseSummoner.data.id;
      userInfo.summonerLevel = responseSummoner.data.summonerLevel;
      try{
        const response = await riotApi.get(
          `champion-mastery/v4/scores/by-summoner/${responseSummoner.data.id}`,
          { params:{ api_key: KEY } });
        userInfo.masteryScore = response.data;
        res.send(userInfo);
      }catch(error){
        return console.log(error);
      }
    }catch(error){
      return console.log(error);
    }
  }
);
  
app.listen(3333);