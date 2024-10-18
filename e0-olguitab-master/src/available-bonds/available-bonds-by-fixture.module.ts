import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableBondsByFixtureSchema } from './available-bonds-by-fixture.schema';
import { AvailableBondsByFixtureService } from './available-bonds-by-fixture.service';
import { AvailableBondsByFixtureController } from './available-bonds-by-fixture.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AvailableBondsByFixture', schema: AvailableBondsByFixtureSchema }]),
  ],
  providers: [AvailableBondsByFixtureService],
  exports: [AvailableBondsByFixtureService],
  controllers: [AvailableBondsByFixtureController],
})
export class AvailableBondsByFixtureModule {}
