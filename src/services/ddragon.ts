import axios from 'axios';

const version = "10.25.1"

const api = axios.create({
    baseURL: "http://ddragon.leagueoflegends.com/cdn/"+ version +"/data/pt_BR"
});

export default api;