-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  credits integer default 10
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This triggers a profile creation when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, credits)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 10);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products table (Stores original uploaded images)
create table products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  original_image_url text not null,
  description text
);

alter table products enable row level security;

create policy "Users can view own products" on products
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own products" on products
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own products" on products
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own products" on products
  for delete using ((select auth.uid()) = user_id);

-- Generations table (Stores AI generated images)
create table generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references products,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt text not null,
  image_url text not null,
  model_used text,
  status text default 'completed'
);

alter table generations enable row level security;

create policy "Users can view own generations" on generations
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own generations" on generations
  for insert with check ((select auth.uid()) = user_id);

-- Storage buckets setup (This usually needs to be done in UI or via specific storage API, 
-- but we can define policies here assuming buckets 'products' and 'generations' exist)

-- Policy for 'products' bucket
-- Note: You need to create a bucket named 'products' in Supabase Storage first.
-- create policy "Authenticated users can upload availability"
-- on storage.objects for insert to authenticated with check (bucket_id = 'products');
