INSERT INTO carts (id, user_id, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'OPEN'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 3);

INSERT INTO cart_items (cart_id, product_id, count) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 1),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 4);
