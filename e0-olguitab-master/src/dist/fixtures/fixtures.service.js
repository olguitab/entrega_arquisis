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
exports.FixtureService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FixtureService = class FixtureService {
    constructor(fixtureModel) {
        this.fixtureModel = fixtureModel;
    }
    async createFixtures(fixturesData) {
        const savedFixtures = await Promise.all(fixturesData.map(async (fixtureData) => {
            const fixture = new this.fixtureModel(fixtureData);
            return await fixture.save();
        }));
        return savedFixtures;
    }
    async getAllFixtures(page, count, filters) {
        const query = this.fixtureModel.find(filters);
        const now = new Date();
        const currentTimestamp = now.getTime();
        if (filters['fixture.date']) {
            filters['fixture.date'] = { $gte: currentTimestamp };
        }
        return query
            .skip((page - 1) * count)
            .limit(count)
            .exec();
    }
    async getFixtureById(id) {
        const fixture = await this.fixtureModel.findOne({ 'fixture.id': id }).exec();
        if (!fixture) {
            throw new common_1.NotFoundException(`Fixture with ID ${id} not found`);
        }
        return fixture;
    }
};
exports.FixtureService = FixtureService;
exports.FixtureService = FixtureService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Fixture')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FixtureService);
//# sourceMappingURL=fixtures.service.js.map