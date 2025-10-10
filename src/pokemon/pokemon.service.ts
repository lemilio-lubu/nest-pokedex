import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { error } from 'console';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class PokemonService {
  //private readonly pokemons : Pokemon[] = [];
  
  private defaultLimit: number;
  constructor(
    // inyecta el modelo de mongoose
    // el name debe ser igual al que se definio en el modulo
    @InjectModel(Pokemon.name)
    // el tipo de dato es Model de mongoose
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) { 

    this.defaultLimit = this.configService.get<number>('limitResults')!;

  }

  // el metodo create es asincrono
  // el dto es un objeto que contiene los datos para crear un pokemon
  async create(createPokemonDto: CreatePokemonDto) {
    // const pokemon = new Pokemon(createPokemonDto);
    // this.pokemons.push(pokemon);
    // return this.pokemons[this.pokemons.length - 1];}
    createPokemonDto.nombre = createPokemonDto.nombre.toLowerCase();
    // usamos el await para esperar la respuesta de la base de datos
    try {
      const createdPokemon = await this.pokemonModel.create(createPokemonDto);
      return createdPokemon;
    } catch (error) {

      this.handleException(error);
    }



  }
  //paginacion
  findAll(paginationDto: PaginationDto) {
    // esto para establecer defenicido limite de 10 y que se despliguye en pagina 0
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .skip(offset)
      .limit(limit)
      .sort({ numeroPokemon: 1 }) // ordena por numero de pokemon
      .select('-__v'); // excluye el campo __v

  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;
    // buscar por numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ numeroPokemon: +term });
    }

    // buscar por mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    // buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ nombre: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new BadRequestException(`Pokemon cant search with term: ${term}`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (updatePokemonDto.nombre) pokemon.nombre = updatePokemonDto.nombre.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {

      this.handleException(error);
    }


    // Lo que hace es devolver el pokemon con los datos actualizados
    // y los datos que se pasaron en el dto

  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} already deleted or not exists`);
    return { deletedCount };
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db:  ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Cant create Pokemon, check in your server logs`);
  }
}
