revoke delete on table "public"."plans" from "anon";

revoke insert on table "public"."plans" from "anon";

revoke references on table "public"."plans" from "anon";

revoke select on table "public"."plans" from "anon";

revoke trigger on table "public"."plans" from "anon";

revoke truncate on table "public"."plans" from "anon";

revoke update on table "public"."plans" from "anon";

revoke delete on table "public"."plans" from "authenticated";

revoke insert on table "public"."plans" from "authenticated";

revoke references on table "public"."plans" from "authenticated";

revoke select on table "public"."plans" from "authenticated";

revoke trigger on table "public"."plans" from "authenticated";

revoke truncate on table "public"."plans" from "authenticated";

revoke update on table "public"."plans" from "authenticated";

revoke delete on table "public"."plans" from "service_role";

revoke insert on table "public"."plans" from "service_role";

revoke references on table "public"."plans" from "service_role";

revoke select on table "public"."plans" from "service_role";

revoke trigger on table "public"."plans" from "service_role";

revoke truncate on table "public"."plans" from "service_role";

revoke update on table "public"."plans" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."subscriptions" from "anon";

revoke insert on table "public"."subscriptions" from "anon";

revoke references on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "anon";

revoke trigger on table "public"."subscriptions" from "anon";

revoke truncate on table "public"."subscriptions" from "anon";

revoke update on table "public"."subscriptions" from "anon";

revoke delete on table "public"."subscriptions" from "authenticated";

revoke insert on table "public"."subscriptions" from "authenticated";

revoke references on table "public"."subscriptions" from "authenticated";

revoke select on table "public"."subscriptions" from "authenticated";

revoke trigger on table "public"."subscriptions" from "authenticated";

revoke truncate on table "public"."subscriptions" from "authenticated";

revoke update on table "public"."subscriptions" from "authenticated";

revoke delete on table "public"."subscriptions" from "service_role";

revoke insert on table "public"."subscriptions" from "service_role";

revoke references on table "public"."subscriptions" from "service_role";

revoke select on table "public"."subscriptions" from "service_role";

revoke trigger on table "public"."subscriptions" from "service_role";

revoke truncate on table "public"."subscriptions" from "service_role";

revoke update on table "public"."subscriptions" from "service_role";

alter table "public"."profiles" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
  values (new.id, 'free', 'active', now(),    now() + interval '30 days');
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

create policy "Disallow direct inserts by users"
on "public"."profiles"
as permissive
for insert
to public
with check (false);


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Disallow direct inserts by users"
on "public"."subscriptions"
as permissive
for insert
to public
with check (false);


create policy "Users can update their own subscription"
on "public"."subscriptions"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own subscription"
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));



CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


