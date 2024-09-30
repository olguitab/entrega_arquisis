import { Schema, Document } from 'mongoose';
export declare const FixtureSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    odds: import("mongoose").Types.DocumentArray<{
        values: import("mongoose").Types.DocumentArray<{
            value?: string;
            odd?: number;
        }>;
        id?: number;
        name?: string;
    }>;
    fixture?: {
        date: NativeDate;
        id?: number;
        referee?: string;
        timezone?: string;
        timestamp?: number;
        status?: {
            long?: string;
            short?: string;
            elapsed?: number;
        };
    };
    league?: {
        id?: number;
        name?: string;
        country?: string;
        logo?: string;
        flag?: string;
        season?: number;
        round?: string;
    };
    teams?: {
        home?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
        away?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
    };
    goals?: {
        home?: number;
        away?: number;
    };
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    odds: import("mongoose").Types.DocumentArray<{
        values: import("mongoose").Types.DocumentArray<{
            value?: string;
            odd?: number;
        }>;
        id?: number;
        name?: string;
    }>;
    fixture?: {
        date: NativeDate;
        id?: number;
        referee?: string;
        timezone?: string;
        timestamp?: number;
        status?: {
            long?: string;
            short?: string;
            elapsed?: number;
        };
    };
    league?: {
        id?: number;
        name?: string;
        country?: string;
        logo?: string;
        flag?: string;
        season?: number;
        round?: string;
    };
    teams?: {
        home?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
        away?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
    };
    goals?: {
        home?: number;
        away?: number;
    };
}>> & import("mongoose").FlatRecord<{
    odds: import("mongoose").Types.DocumentArray<{
        values: import("mongoose").Types.DocumentArray<{
            value?: string;
            odd?: number;
        }>;
        id?: number;
        name?: string;
    }>;
    fixture?: {
        date: NativeDate;
        id?: number;
        referee?: string;
        timezone?: string;
        timestamp?: number;
        status?: {
            long?: string;
            short?: string;
            elapsed?: number;
        };
    };
    league?: {
        id?: number;
        name?: string;
        country?: string;
        logo?: string;
        flag?: string;
        season?: number;
        round?: string;
    };
    teams?: {
        home?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
        away?: {
            id?: number;
            name?: string;
            logo?: string;
            winner?: string;
        };
    };
    goals?: {
        home?: number;
        away?: number;
    };
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export interface Fixture extends Document {
    fixture: {
        id: number;
        referee: string;
        timezone: string;
        date: {
            type: Date;
            required: true;
        };
        timestamp: number;
        status: {
            long: string;
            short: string;
            elapsed: number;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
        round: string;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            winner: string;
        };
        away: {
            id: number;
            name: string;
            logo: string;
            winner: string;
        };
    };
    goals: {
        home: number;
        away: number;
    };
    odds: [
        {
            id: number;
            name: string;
            values: [
                {
                    value: string;
                    odd: number;
                }
            ];
        }
    ];
}
