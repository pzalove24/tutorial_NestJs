import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BenchmarkTypesModule } from './benchmark-types/benchmark-types.module';
import { BenchmarkInformationsModule } from './benchmark-informations/benchmark-informations.module';
import { BenchmarkMethodsModule } from './benchmark-methods/benchmark-methods.module';
import { BenchmarkInputsModule } from './benchmark-inputs/benchmark-inputs.module';
import { BenchmarkInputSetupsModule } from './benchmark-input-setups/benchmark-input-setups.module';
import { BenchmarkUnitsModule } from './benchmark-units/benchmark-units.module';
import { BenchmarkDefinitionsModule } from './benchmark-definitions/benchmark-definitions.module';
import { PaperReferencesModule } from './paper-references/paper-references.module';
import { BenchmarkResultsModule } from './benchmark-results/benchmark-results.module';
import { SerialportModule } from './serialport/serialport.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [BenchmarkTypesModule, BenchmarkInformationsModule, BenchmarkMethodsModule, BenchmarkInputsModule, BenchmarkInputSetupsModule, BenchmarkUnitsModule, BenchmarkDefinitionsModule, PaperReferencesModule, BenchmarkResultsModule, SerialportModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
