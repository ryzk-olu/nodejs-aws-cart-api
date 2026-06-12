import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Cart } from '../models';
import { PutCartPayload } from 'src/order/type';
import { DatabaseService } from './database.service';
import axios from 'axios';

@Injectable()
export class CartService {
  constructor(private db: DatabaseService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const result = await this.db.query(
      `SELECT c.*, json_agg(
        json_build_object('product', json_build_object('id', ci.product_id), 'count', ci.count)
      ) FILTER (WHERE ci.cart_id IS NOT NULL) as items
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = $1 AND c.status = 'OPEN'
      GROUP BY c.id
      LIMIT 1`,
      [userId]
    );
    const row = result.rows[0];
    if (!row) return null;

    const items = row.items || [];
    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        try {
          const res = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/products/${item.product.id}`
          );
          return { ...item, product: res.data };
        } catch {
          return item;
        }
      })
    );

    return { ...row, items: enrichedItems };
  }

  async createByUserId(userId: string): Promise<Cart> {
    const result = await this.db.query(
      `INSERT INTO carts (id, user_id, created_at, updated_at, status)
       VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE, 'OPEN')
       RETURNING *`,
      [randomUUID(), userId]
    );
    return { ...result.rows[0], items: [] };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (cart) return cart;
    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
    const existing = await this.db.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cart.id, payload.product.id]
    );
    if (existing.rows.length === 0) {
      await this.db.query(
        `INSERT INTO cart_items (cart_id, product_id, count) VALUES ($1, $2, $3)`,
        [cart.id, payload.product.id, payload.count]
      );
    } else if (payload.count === 0) {
      await this.db.query(
        `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cart.id, payload.product.id]
      );
    } else {
      await this.db.query(
        `UPDATE cart_items SET count = $1 WHERE cart_id = $2 AND product_id = $3`,
        [payload.count, cart.id, payload.product.id]
      );
    }
    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.db.query(
      `UPDATE carts SET status = 'ORDERED', updated_at = CURRENT_DATE
       WHERE user_id = $1 AND status = 'OPEN'`,
      [userId]
    );
  }

  async checkout(userId: string, total: number, delivery: any, comments: string): Promise<void> {
    const client = await this.db.pool.connect();
    try {
      await client.query('BEGIN');

      const cartResult = await client.query(
        `SELECT id FROM carts WHERE user_id = $1 AND status = 'OPEN' LIMIT 1`,
        [userId]
      );
      const cartId = cartResult.rows[0]?.id;
      if (!cartId) throw new Error('Cart not found');

      await client.query(
        `INSERT INTO orders (user_id, cart_id, delivery, comments, status, total)
         VALUES ($1, $2, $3, $4, 'ORDERED', $5)`,
        [userId, cartId, JSON.stringify(delivery), comments || '', total]
      );

      await client.query(
        `UPDATE carts SET status = 'ORDERED', updated_at = CURRENT_DATE WHERE id = $1`,
        [cartId]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findUserById(userId: string) {
    const result = await this.db.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async createUser(name: string, email: string, password: string) {
    const result = await this.db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );
    return result.rows[0];
  }
}
