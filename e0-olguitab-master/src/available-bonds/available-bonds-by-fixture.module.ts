import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableBondsByFixtureSchema } from './available-bonds-by-fixture.schema';
import { AvailableBondsByFixtureService } from './available-bonds-by-fixture.service';
import { AvailableBondsByFixtureController } from './available-bonds-by-fixture.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AvailableBondsByFixture', schema: AvailableBondsByFixtureSchema }]),  // Registrar el esquema
  ],
  providers: [AvailableBondsByFixtureService],  // Proveer el servicio
  exports: [AvailableBondsByFixtureService],
  controllers: [AvailableBondsByFixtureController],  // Registrar el controlador (si lo necesitas)
})
export class AvailableBondsByFixtureModule {}
