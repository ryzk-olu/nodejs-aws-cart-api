
import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()

export class DatabaseService {

  public pool: Pool;

  constructor() {

    this.pool = new Pool({

      host: process.env.DB_HOST,

      port: parseInt(process.env.DB_PORT || '5432'),

      database: process.env.DB_NAME || 'postgres',

      user: process.env.DB_USER || 'postgres',

      password: process.env.DB_PASSWORD,

      ssl: { rejectUnauthorized: false },

    });

  }

  async query(text: string, params?: any[]) {

    const client = await this.pool.connect();

    try {

      return await client.query(text, params);

    } finally {

      client.release();

    }

  }

}

