import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// hereda de document para que mongoose lo reconozca
// define los tipos de datos que va a tener el modelo
@Schema()
export class Pokemon extends Document {
    @Prop({
        unique: true,
        index: true 
    })
    numeroPokemon: number;
    
    @Prop({
        unique: true,
        index: true 
    })
    nombre: string;
    
    
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);






