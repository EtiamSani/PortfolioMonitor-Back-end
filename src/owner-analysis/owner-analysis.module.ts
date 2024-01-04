import { Module } from '@nestjs/common';
import { OwnerAnalysisController } from './owner-analysis.controller';
import { OwnerAnalysisService } from './owner-analysis.service';

@Module({
  controllers: [OwnerAnalysisController],
  providers: [OwnerAnalysisService]
})
export class OwnerAnalysisModule {}
