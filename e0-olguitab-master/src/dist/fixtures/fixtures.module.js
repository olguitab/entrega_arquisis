"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixturesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fixtures_schema_1 = require("./fixtures.schema");
const fixtures_controller_1 = require("./fixtures.controller");
const fixtures_service_1 = require("./fixtures.service");
let FixturesModule = class FixturesModule {
};
exports.FixturesModule = FixturesModule;
exports.FixturesModule = FixturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Fixture', schema: fixtures_schema_1.FixtureSchema }]),
        ],
        providers: [fixtures_service_1.FixtureService],
        controllers: [fixtures_controller_1.FixturesController],
    })
], FixturesModule);
//# sourceMappingURL=fixtures.module.js.map