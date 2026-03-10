-- MySQL to PostgreSQL Data Migration Script
-- Run this script against the NEW PostgreSQL database after setting up the Prisma schema.
--
-- Prerequisites:
--   1. Run `prisma migrate dev` to create the PostgreSQL schema
--   2. Export MySQL data as CSV or use a tool like pgloader
--
-- Option A: Using pgloader (recommended)
-- Install: brew install pgloader (macOS) or apt-get install pgloader (Linux)
--
-- pgloader command:
--   pgloader mysql://user:pass@localhost/haengdong postgresql://postgres:postgres@localhost/haengdong
--
-- Option B: Manual SQL migration (adjust column names as needed)

-- Step 1: Migrate users
INSERT INTO users (id, nickname, password, bank_name, account_number, member_number, picture, created_at, updated_at)
SELECT
  id,
  nickname,
  password,
  bank_name,
  account_number,
  member_number,
  picture,
  created_at,
  COALESCE(updated_at, NOW())
FROM mysql_export.users;

-- Step 2: Migrate events
INSERT INTO events (id, name, token, user_id, bank_name, account_number, created_by_guest, deleted_at, created_at, updated_at)
SELECT
  id,
  name,
  token,
  user_id,
  bank_name,
  account_number,
  CASE WHEN created_by_guest = 1 THEN true ELSE false END,
  deleted_at,
  created_at,
  COALESCE(updated_at, NOW())
FROM mysql_export.event;

-- Step 3: Migrate event members
INSERT INTO event_members (id, event_id, name, is_deposited, created_at)
SELECT
  id,
  event_id,
  name,
  CASE WHEN is_deposited = 1 THEN true ELSE false END,
  created_at
FROM mysql_export.event_member;

-- Step 4: Migrate bills
INSERT INTO bills (id, event_id, title, price, created_at, updated_at)
SELECT
  id,
  event_id,
  title,
  price,
  created_at,
  COALESCE(updated_at, NOW())
FROM mysql_export.bill;

-- Step 5: Migrate bill details
INSERT INTO bill_details (id, bill_id, member_id, price, is_fixed)
SELECT
  id,
  bill_id,
  event_member_id,
  price,
  CASE WHEN is_fixed = 1 THEN true ELSE false END
FROM mysql_export.bill_detail;

-- Step 6: Migrate event images
INSERT INTO event_images (id, event_id, name, created_at)
SELECT
  id,
  event_id,
  name,
  created_at
FROM mysql_export.event_image;

-- Step 7: Reset sequences to avoid ID conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));
SELECT setval('event_members_id_seq', (SELECT MAX(id) FROM event_members));
SELECT setval('bills_id_seq', (SELECT MAX(id) FROM bills));
SELECT setval('bill_details_id_seq', (SELECT MAX(id) FROM bill_details));
SELECT setval('event_images_id_seq', (SELECT MAX(id) FROM event_images));
