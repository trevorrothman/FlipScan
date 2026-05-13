CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_usage_logs_ip ON usage_logs(ip_address);

CREATE TABLE paid_usage (
    ip_address TEXT PRIMARY KEY,
    paid_until TIMESTAMP WITH TIME ZONE,
    remaining_reports INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
