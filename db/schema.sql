CREATE TABLE IF NOT EXISTS budget_tracker_app_cztuh_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget_tracker_app_cztuh_spending_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES budget_tracker_app_cztuh_users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(100) NOT NULL,
  description VARCHAR(200),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget_tracker_app_cztuh_savings_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES budget_tracker_app_cztuh_users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(200),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget_tracker_app_cztuh_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES budget_tracker_app_cztuh_users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_spending_entries_user_id ON budget_tracker_app_cztuh_spending_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_spending_entries_date ON budget_tracker_app_cztuh_spending_entries(date);
CREATE INDEX IF NOT EXISTS idx_savings_entries_user_id ON budget_tracker_app_cztuh_savings_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON budget_tracker_app_cztuh_categories(user_id);
