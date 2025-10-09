import { createClient } from '@/lib/supabase/server';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | null;

export interface UserSubscription {
    id: string;
    user_id: string;
    status: SubscriptionStatus;
    plan_id: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Get the current user's subscription from the database
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }

    return data as UserSubscription;
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
    const subscription = await getUserSubscription();

    if (!subscription) {
        return false;
    }

    return subscription.status === 'active' || subscription.status === 'trialing';
}

/**
 * Check if user has access to a specific feature based on their plan
 */
export async function hasFeatureAccess(feature: string): Promise<boolean> {
    const subscription = await getUserSubscription();

    if (!subscription || !hasActiveSubscription()) {
        return false;
    }

    // Define your plan features here
    const planFeatures: Record<string, string[]> = {
        'free': ['basic_feature'],
        'pro': ['basic_feature', 'advanced_feature', 'priority_support'],
        'enterprise': ['basic_feature', 'advanced_feature', 'priority_support', 'custom_integration'],
    };

    const features = planFeatures[subscription.plan_id] || [];
    return features.includes(feature);
}

/**
 * Get subscription expiry date
 */
export async function getSubscriptionExpiryDate(): Promise<Date | null> {
    const subscription = await getUserSubscription();

    if (!subscription) {
        return null;
    }

    return new Date(subscription.current_period_end);
}

/**
 * Check if subscription is about to expire (within 7 days)
 */
export async function isSubscriptionExpiringSoon(): Promise<boolean> {
    const expiryDate = await getSubscriptionExpiryDate();

    if (!expiryDate) {
        return false;
    }

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return expiryDate <= sevenDaysFromNow;
}
