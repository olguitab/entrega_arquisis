"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBonusModule = void 0;
const common_1 = require("@nestjs/common");
const user_bonus_service_1 = require("./user-bonus.service");
const user_bonus_controller_1 = require("./user-bonus.controller");
let UserBonusModule = class UserBonusModule {
};
exports.UserBonusModule = UserBonusModule;
exports.UserBonusModule = UserBonusModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_bonus_controller_1.UserBonusController],
        providers: [user_bonus_service_1.UserBonusService],
    })
], UserBonusModule);
//# sourceMappingURL=user-bonus.module.js.map