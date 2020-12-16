const express = require('express');
const cors = require('cors');
import riotApi from './services/riot-api';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/:summoner',async function (req,res){
  const summoner = req.params.summoner;
  const response = await riotApi.get(`summoner/v4/summoners/by-name/${summoner}`, 
  {
    params:{
      api_key: 'RGAPI-c48989cb-b4ca-4b9b-a86e-c154f7e978c5'
    }
  })
  res.json(response.data);
  return response;
}
    /*res.data = await riotApi.get(`summoner/v4/summoners/by-name/Korrakun`, 
    {
      params:{
        api_key: 'RGAPI-c48989cb-b4ca-4b9b-a86e-c154f7e978c5'
      }
    })*/

)

app.listen(3333);