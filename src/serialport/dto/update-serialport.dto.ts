import { PartialType } from '@nestjs/mapped-types';
import { CreateSerialportDto } from './create-serialport.dto';

export class UpdateSerialportDto extends PartialType(CreateSerialportDto) {
  id: number;
}
