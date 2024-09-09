"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FixtureSchema = new mongoose_1.Schema({
    fixture: {
        id: Number,
        referee: String,
        timezone: String,
        date: { type: Date, required: true },
        timestamp: Number,
        status: {
            long: String,
            short: String,
            elapsed: Number,
        },
    },
    league: {
        id: Number,
        name: String,
        country: String,
        logo: String,
        flag: String,
        season: Number,
        round: String,
    },
    teams: {
        home: {
            id: Number,
            name: String,
            logo: String,
            winner: String,
        },
        away: {
            id: Number,
            name: String,
            logo: String,
            winner: String,
        },
    },
    goals: {
        home: Number,
        away: Number,
    },
    odds: [
        {
            id: Number,
            name: String,
            values: [
                {
                    value: String,
                    odd: Number,
                },
            ],
        },
    ],
});
//# sourceMappingURL=fixtures.schema.js.map