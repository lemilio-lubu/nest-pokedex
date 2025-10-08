import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';

@Injectable()
export class SeedService {

  // instancia de axios
  // AxiosIntance me permite hacer peticiones http
  private readonly axios: AxiosInstance = axios;



  async executeSeed() {
    //  logica para poder obtener los datos externos de un api
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')
    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length -2]; // obtener el penultimo elemento
      console.log({no, name});
    });
    
    return data;
  }
}
