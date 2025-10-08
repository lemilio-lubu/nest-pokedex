import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log({ value, metadata });
    // validar que el id es un mongoId valido
    if (!isValidObjectId(value)) {
      throw new Error(`El id ${value} no es un mongoId valido`);
    }
    return value;
  }
}
