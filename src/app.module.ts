import { join } from 'path'; // paquete de node
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { AppConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load: [AppConfiguration],
        validationSchema: JoiValidationSchema,
      }
    ),
    // esto es para servir contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // esto es importante para conectar con mongo en espcial el url
    MongooseModule.forRoot( process.env.MONGODB!, {
      dbName: 'pokedex' // nombre de la base de datos
    } ),

    PokemonModule,

    CommonModule,

    SeedModule,
  ]
})
export class AppModule {
  
}
