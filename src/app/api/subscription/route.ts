import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch user's subscription
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create or update subscription
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { plan_id, status = 'active' } = body;

        if (!plan_id) {
            return NextResponse.json({ error: 'plan_id is required' }, { status: 400 });
        }

        // Calculate period dates
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: user.id,
                plan_id,
                status,
                current_period_start: currentPeriodStart.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
                cancel_at_period_end: false,
            }, {
                onConflict: 'user_id',
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Error creating/updating subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update subscription (e.g., cancel)
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { cancel_at_period_end, status } = body;

        const updateData: Record<string, any> = {};
        if (typeof cancel_at_period_end === 'boolean') {
            updateData.cancel_at_period_end = cancel_at_period_end;
        }
        if (status) {
            updateData.status = status;
        }

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
