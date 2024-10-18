import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AvailableBondsByFixtureService } from './available-bonds-by-fixture.service';

@Controller('available-bonds')
export class AvailableBondsByFixtureController {
    constructor(private readonly availableBondsByFixtureService: AvailableBondsByFixtureService) {}

    @Post()
    async createAvailableBonds(@Body('fixtureId') fixtureId: number, @Body('availableBonds') availableBonds: number) {
        return this.availableBondsByFixtureService.createAvailableBondsByFixture(fixtureId, availableBonds);
    }


    @Get(':fixtureId')  // El endpoint será /available-bonds/:fixtureId
    async getAvailableBondsByFixture(@Param('fixtureId') fixtureId: number) {
        const availableBonds = await this.availableBondsByFixtureService.findAvailableBondsByFixture(fixtureId);
        if (!availableBonds) {
            return { message: 'No available bonds found for this fixture.' };
        }
        return availableBonds.availableBonds;
    }

      // Endpoint para decrementar los availableBonds por fixtureId
    @Post(':fixtureId/decrement/:quantity')
    async decrementAvailableBondsByFixture(
        @Param('fixtureId') fixtureId: number,
        @Param('quantity') quantity: number
        ) {
        try {
            const result = await this.availableBondsByFixtureService.decrementAvailableBonds(fixtureId, Number(quantity));
        if (!result) {
            return { message: `No available bonds found for fixtureId: ${fixtureId}` };
        }
        return { message: `Successfully decremented available bonds for fixtureId: ${fixtureId}` };
        } catch (error) {
            return { message: `Error processing the request: ${error.message}` };
        }
    }

    @Post('validation')
    async receiveValidation(
        @Body('fixtureId') fixtureId: number,
        @Body('quantity') quantity: number,
        @Body('validation') validation: boolean,
        ) {
        try {
            const result = await this.availableBondsByFixtureService.receiveValidation(fixtureId, quantity, validation);
            if (!result) {
            return { message: `No changes to available bonds for fixtureId: ${fixtureId}` };
            }
        return { message: `Successfully processed validation for fixtureId: ${fixtureId}` };
        } catch (error) {
            return { message: `Error processing the request: ${error.message}` };
        }
    }
}
