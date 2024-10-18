import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AvailableBondsByFixtureService } from './available-bonds-by-fixture.service';

@Controller('available-bonds')
export class AvailableBondsByFixtureController {
    constructor(private readonly availableBondsByFixtureService: AvailableBondsByFixtureService) {}

    @Post()
    async createAvailableBonds(@Body('fixtureId') fixtureId: number, @Body('availableBonds') availableBonds: number) {
        return this.availableBondsByFixtureService.createAvailableBondsByFixture(fixtureId, availableBonds);
    }

    // @Get(':fixtureId')
    // async getAvailableBondsByFixture(@Param('fixtureId') fixtureId: number) {
    //     return this.availableBondsByFixtureService.findAvailableBondsByFixture(fixtureId);
    // }
}
