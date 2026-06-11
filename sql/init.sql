CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
  status cart_status NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE cart_items (
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (cart_id, product_id)
);
