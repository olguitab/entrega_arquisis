import { Schema, Document } from 'mongoose';

export const FixtureSchema = new Schema({
  //bono_disponible: { type: Number, default: 40 },
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

export interface Fixture extends Document {
  bono_disponible: number;
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: { type: Date, required: true };
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
        },
      ];
    },
  ];
}