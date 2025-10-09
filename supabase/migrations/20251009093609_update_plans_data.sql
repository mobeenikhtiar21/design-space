-- Update plans with new data matching the design
UPDATE public.plans
SET 
    name = 'Free',
    description = 'Perfect for getting started',
    price_monthly = 0.00,
    price_yearly = 0.00,
    features = jsonb_build_array(
        '5 Active Projects',
        'Full Drawing Tools',
        'Standard Furniture Library',
        'PDF & SVG Export',
        '1GB Cloud Storage',
        'Community Support'
    ),
    sort_order = 1,
    updated_at = NOW()
WHERE id = 'free';

UPDATE public.plans
SET 
    name = 'Professional',
    description = 'For serious designers',
    price_monthly = 29.00,
    price_yearly = 290.00, -- Assuming 10 months discount
    features = jsonb_build_array(
        'Unlimited Projects',
        'Advanced AI Commands',
        'Complete Furniture Library',
        'DWG & DXF Import/Export',
        '50GB Cloud Storage',
        'Priority Support',
        'Team Collaboration',
        'Custom Templates'
    ),
    sort_order = 2,
    updated_at = NOW()
WHERE id = 'pro';

UPDATE public.plans
SET 
    name = 'Enterprise',
    description = 'For teams and organizations',
    price_monthly = 99.00,
    price_yearly = 990.00, -- Assuming 10 months discount
    features = jsonb_build_array(
        'Everything in Professional',
        'Unlimited Team Members',
        '1TB Cloud Storage',
        'Custom Integrations',
        'Advanced Security',
        'Dedicated Support',
        'On-premise Option',
        'SLA Guarantee'
    ),
    sort_order = 3,
    updated_at = NOW()
WHERE id = 'enterprise';
