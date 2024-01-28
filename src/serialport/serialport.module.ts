import { Module } from '@nestjs/common';
import { SerialportService } from './serialport.service';
import { SerialportGateway } from './serialport.gateway';

@Module({
  providers: [SerialportGateway, SerialportService],
})
export class SerialportModule {}
