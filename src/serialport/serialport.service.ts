import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSerialportDto } from './dto/create-serialport.dto';
import { UpdateSerialportDto } from './dto/update-serialport.dto';
import { SerialPort, ReadlineParser } from 'serialport';
import { PortInfo } from '@serialport/bindings-interface';

@Injectable()
export class SerialportService {
  // private port = new SerialPort({
  //   path: COM,
  //   baudRate: 9600,
  // });

  private serialConnections: Record<string, SerialPort> = {}; // To store multiple connections
  private readlineParser: Record<string, ReadlineParser> = {};

  create(createSerialportDto: CreateSerialportDto) {
    return 'This action adds a new serialport';
  }

  async getSerialportsList(): Promise<PortInfo[]> {
    const ports: PortInfo[] = await SerialPort.list();
    return ports;
  }

  createSerialConnection(COM: string): SerialPort {
    if (!this.serialConnections[COM]) {
      // Create a new serial connection if it doesn't exist
      this.serialConnections[COM] = new SerialPort({
        path: COM,
        baudRate: 9600,
        autoOpen:false,
        endOnClose: true,
      });
    }
    return this.serialConnections[COM];
  }


  createParser(COM: string) {
    if (this.serialConnections[COM]) {
      this.readlineParser[COM] = this.serialConnections[COM].pipe(
        new ReadlineParser({ delimiter: '\r\n' }),
      );
    }

    return this.readlineParser[COM];
  }

  getSerialConnection(COM: string): SerialPort {
    if (this.serialConnections[COM]) {
      return this.serialConnections[COM];
    }

    throw new NotFoundException(`Error Receive Data at COMPORT: ${COM}`);
  }

  deleteSerialConnection(COM: string): SerialPort {
    if (this.serialConnections[COM]) {
      delete this.serialConnections[COM];
    }

    throw new NotFoundException(`Error Delete at COMPORT: ${COM}`);
  }
}
