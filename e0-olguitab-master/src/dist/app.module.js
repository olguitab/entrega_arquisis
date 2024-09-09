"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fixtures_schema_1 = require("./fixtures/fixtures.schema");
const fixtures_controller_1 = require("./fixtures/fixtures.controller");
const fixtures_service_1 = require("./fixtures/fixtures.service");
const mqtt_service_1 = require("./mqtt/mqtt.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/e0bd'),
            mongoose_1.MongooseModule.forFeature([{ name: 'Fixture', schema: fixtures_schema_1.FixtureSchema }]),
        ],
        controllers: [fixtures_controller_1.FixturesController],
        providers: [fixtures_service_1.FixtureService, mqtt_service_1.MqttService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map