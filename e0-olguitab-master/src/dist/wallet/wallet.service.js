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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../user/user.schema");
const wallet_schema_1 = require("./wallet.schema");
let WalletService = class WalletService {
    constructor(userModel, walletModel) {
        this.userModel = userModel;
        this.walletModel = walletModel;
    }
    async createWalletForExistingUsers() {
        const users = await this.userModel.find();
        for (const user of users) {
            const existingWallet = await this.walletModel.findOne({ user_id: user._id });
            if (!existingWallet) {
                await this.createWallet(user._id);
            }
        }
    }
    async createWallet(user_id) {
        await this.walletModel.create({
            user_id,
            money: 0,
        });
    }
    async addMoneyToWallet(user_id, amount) {
        await this.walletModel.updateOne({ user_id }, { $inc: { money: amount } });
    }
    async getWalletBalance(user_id) {
        const wallet = await this.walletModel.findOne({ user_id });
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        return wallet.money;
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WalletService);
//# sourceMappingURL=wallet.service.js.map