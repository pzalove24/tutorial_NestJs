import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SerialportService } from './serialport.service';
import { CreateSerialportDto } from './dto/create-serialport.dto';
import { UpdateSerialportDto } from './dto/update-serialport.dto';
import { Server } from 'socket.io';
import { NotFoundException } from '@nestjs/common';
import { commandBenchmark } from './dto/command-benchmark.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SerialportGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly serialportService: SerialportService) {}

  handleConnection(client: any, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any): any {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('serialPortList')
  async getSerialPortsList() {
    try {
      const ports = await this.serialportService.getSerialportsList();
      this.server.emit('COMPORT_SOCKET', ports);
      return ports;
    } catch (error) {
      throw new NotFoundException('Error listing serial ports');
    }
  }

  @SubscribeMessage('selectedCOMPORT')
  async connectCOMPORT(@MessageBody('COM') COM: string) {
    try {
      if (COM) {
        const serialConnection =
          this.serialportService.createSerialConnection(COM);

        const parser = this.serialportService.createParser(COM);
        console.log('serialCOnnection', serialConnection);

        //on data callback broadcast to the default socketio connection
        const sendBenchmarkData = (benchmarkData) => {
          console.log(benchmarkData);
          this.server.emit('benchmark_data', benchmarkData);
        };

        serialConnection.open(function (err) {
          console.log(err);
          parser.on('data', (benchmarkData) => {
            sendBenchmarkData(benchmarkData);
          });
          if (err) {
            return console.log('Error opening serialConnection: ', err.message);
          }
        });

        console.log('render');

        //close handling by backend
        const closeSerialPortByUSB = () => {
          console.log('close serial connection');
          this.server.emit('disconnectByUSB', 'USBdisconnected');
        };

        serialConnection.on('close', closeSerialPortByUSB);

        //error handling
        serialConnection.on('error', function () {
          console.log("Can't establish serial connection " + COM);
          process.exit(1);
        });
      }
    } catch (error) {
      throw new NotFoundException(`Error Receive Data at COMPORT: ${COM}`);
    }
  }

  @SubscribeMessage('disconnectCOMPORT')
  async disconnectCOMPORT(@MessageBody('COM') COM: string) {
    if (COM) {
      //close handling by frontend
      const serialConnection = this.serialportService.getSerialConnection(COM);
      serialConnection.close(function (err) {
        console.log('end serial connection', err);
      });
      this.serialportService.deleteSerialConnection;
    }
  }

  @SubscribeMessage('command_benchmark')
  async commandBenchmark(
    @MessageBody()
    commandBenchmark: commandBenchmark,
  ) {
    if (commandBenchmark.COM) {
      const serialConnection = this.serialportService.getSerialConnection(
        commandBenchmark.COM,
      );
      //relay socket.io writes to the serial port
      console.log(commandBenchmark.command);
      serialConnection.write(commandBenchmark.command);
    }
  }

}
