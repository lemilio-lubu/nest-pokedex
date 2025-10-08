import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // instancia de axios
  // AxiosIntance me permite hacer peticiones http
  private readonly axios: AxiosInstance = axios;

  constructor(
     @InjectModel(Pokemon.name)
        // el tipo de dato es Model de mongoose
      private readonly pokemonModel: Model<Pokemon>,
      private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    //  logica para poder obtener los datos externos de un api


    await this.pokemonModel.deleteMany({}); // borrar todos los registros antes de insertar

    // obtener los primeros 10 pokemones

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: {numeroPokemon: number, nombre: string}[] = [];
    
    
    data.results.forEach( async ({name, url}) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length -2]; // obtener el penultimo elemento
      const createdPokemon = await this.pokemonModel.create({numeroPokemon: no, nombre: name});

      pokemonToInsert.push({numeroPokemon: no, nombre: name});
    });

    // esto solo se usa para insertar muchos registros a la vez en una insercion masiva
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
