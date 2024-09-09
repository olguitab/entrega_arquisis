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
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
const axios_1 = require("axios");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let MqttService = class MqttService {
    constructor(fixtureModel) {
        this.fixtureModel = fixtureModel;
        this.client = mqtt.connect('mqtt://broker.iic2173.org:9000', {
            username: 'students',
            password: 'iic2173-2024-2-students',
        });
        this.client.on('connect', () => {
            console.log('Conexión exitosa al broker MQTT');
            this.client.subscribe('fixtures/info', (err) => {
                if (err) {
                    console.error('Error en la suscripción:', err);
                }
                else {
                    console.log('Suscripción exitosa a fixtures/info');
                }
            });
        });
        this.client.on('error', (err) => {
            console.error('Error en la conexión MQTT:', err);
        });
        this.client.on('message', async (topic, message) => {
            try {
                const doubleParsedMessage = JSON.parse(JSON.parse(message.toString()));
                console.log('Sending double parsed message to controller...');
                await axios_1.default.post('http://localhost:3000/fixtures/process', {
                    topic: topic,
                    message: doubleParsedMessage,
                });
            }
            catch (error) {
                console.error('Error al procesar el mensaje MQTT:', error);
            }
        });
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Fixture')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map