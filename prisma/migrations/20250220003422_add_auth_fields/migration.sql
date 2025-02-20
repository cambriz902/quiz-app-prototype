-- First add the columns with nullable constraint
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Update existing rows with default values
UPDATE "User" SET 
    email = CONCAT('user_', id, '@example.com'),
    password = 'CHANGE_ME_HASH';

-- Then make the columns non-nullable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- Finally add the unique constraint
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");