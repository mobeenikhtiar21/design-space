-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
    plan_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read their own subscription
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only authenticated users can read subscriptions
CREATE POLICY "Authenticated users can view subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Service role can manage all subscriptions (for webhook handlers)
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create plans table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    stripe_price_id_monthly TEXT,
    stripe_price_id_yearly TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Anyone can view plans
CREATE POLICY "Plans are viewable by everyone"
    ON public.plans
    FOR SELECT
    USING (is_active = true);

-- Insert default plans
INSERT INTO public.plans (id, name, description, price_monthly, price_yearly, features, sort_order) VALUES
    ('free', 'Free', 'Perfect for getting started', 0, 0, '["Up to 3 projects", "Basic analytics", "Community support"]'::jsonb, 1),
    ('pro', 'Pro', 'For professional creators', 19.99, 199.99, '["Unlimited projects", "Advanced analytics", "Priority support", "Custom branding"]'::jsonb, 2),
    ('enterprise', 'Enterprise', 'For large organizations', 99.99, 999.99, '["Everything in Pro", "Dedicated support", "Custom integrations", "SLA guarantee", "Team collaboration"]'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;

-- Add foreign key constraint (optional)
ALTER TABLE public.subscriptions
ADD CONSTRAINT fk_subscription_plan
FOREIGN KEY (plan_id) REFERENCES public.plans(id)
ON DELETE RESTRICT;
