"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixturesController = void 0;
const common_1 = require("@nestjs/common");
const fixtures_service_1 = require("./fixtures.service");
let FixturesController = class FixturesController {
    constructor(fixtureService) {
        this.fixtureService = fixtureService;
    }
    async processFixtures(requestBody) {
        try {
            console.log('Received request body:', requestBody);
            const { message } = requestBody;
            if (!message || !Array.isArray(message.fixtures)) {
                console.log('Invalid data format:', requestBody);
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Invalid data format',
                };
            }
            const fixtures = message.fixtures;
            console.log('Processing fixtures:', fixtures);
            const savedFixtures = await this.fixtureService.createFixtures(fixtures);
            console.log('Saved fixtures:', savedFixtures);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Fixtures created successfully',
                data: savedFixtures,
            };
        }
        catch (error) {
            console.error('Error processing fixtures:', error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
            };
        }
    }
    async getFixtureById(id) {
        try {
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const fixture = await this.fixtureService.getFixtureById(numericId);
            return {
                statusCode: common_1.HttpStatus.OK,
                data: fixture,
            };
        }
        catch (error) {
            console.error('Error al obtener el fixture:', error);
            throw error;
        }
    }
    async getAllFixtures(page = '1', count = '25', home, away, visit, date) {
        try {
            const pageNumber = parseInt(page, 10);
            const countNumber = parseInt(count, 10);
            if (pageNumber <= 0 || countNumber <= 0) {
                throw new common_1.BadRequestException('Invalid page or count number');
            }
            const filters = {};
            if (home) {
                filters['teams.home.name'] = home;
            }
            if (away || visit) {
                filters['teams.away.name'] = away || visit;
            }
            if (date) {
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime())) {
                    throw new common_1.BadRequestException('Invalid date format');
                }
                filters['fixture.date'] = { $gte: dateObj };
            }
            const fixtures = await this.fixtureService.getAllFixtures(pageNumber, countNumber, filters);
            return {
                statusCode: common_1.HttpStatus.OK,
                data: fixtures,
            };
        }
        catch (error) {
            console.error('Error al obtener fixtures:', error);
            throw error;
        }
    }
};
exports.FixturesController = FixturesController;
__decorate([
    (0, common_1.Post)('process'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FixturesController.prototype, "processFixtures", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FixturesController.prototype, "getFixtureById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('count')),
    __param(2, (0, common_1.Query)('home')),
    __param(3, (0, common_1.Query)('away')),
    __param(4, (0, common_1.Query)('visit')),
    __param(5, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FixturesController.prototype, "getAllFixtures", null);
exports.FixturesController = FixturesController = __decorate([
    (0, common_1.Controller)('fixtures'),
    __metadata("design:paramtypes", [fixtures_service_1.FixtureService])
], FixturesController);
//# sourceMappingURL=fixtures.controller.js.map