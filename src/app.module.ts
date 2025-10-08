import { join } from 'path/win32'; // paquete de node
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // esto es importante para conectar con mongo en espcial el url
    MongooseModule.forRoot('mongodb://localhost:27017/pokedex'),

    PokemonModule,

    CommonModule,

    SeedModule,
  ]
})
export class AppModule {}
