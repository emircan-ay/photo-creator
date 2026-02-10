# Critical Setup Instructions

The application code is built and compiles successfully! To make the app functionality (Login, Upload, Generation) work, you must set up your Supabase project manually since we don't have direct access to run these commands.

## 1. Database Setup (SQL Editor)

Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> **SQL Editor** -> **New Query**.
Paste and run the following SQL script to create the necessary tables and policies:

```sql
-- Join public profiles to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  credits integer default 10
);

-- RLS Policies for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, credits)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 10);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  original_image_url text not null,
  description text
);

alter table products enable row level security;
create policy "Users can view own products" on products for select using ((select auth.uid()) = user_id);
create policy "Users can insert own products" on products for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own products" on products for update using ((select auth.uid()) = user_id);
create policy "Users can delete own products" on products for delete using ((select auth.uid()) = user_id);

-- Generations Table
create table if not exists generations (
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
create policy "Users can view own generations" on generations for select using ((select auth.uid()) = user_id);
create policy "Users can insert own generations" on generations for insert with check ((select auth.uid()) = user_id);
```

## 2. Storage Setup

1. Go to **Storage** in the Supabase Dashboard.
2. Click **New Bucket**.
3. Name it: `products`
4. Tick **"Public bucket"**.
5. Click **Save**.

## 3. Policy for Storage (SQL)
Run this optional SQL to ensure uploads work (or configure in Storage UI to allow authenticated uploads):

```sql
-- Allow authenticated uploads to 'products' bucket
-- Note: This is a simplified policy. Adjust as needed.
create policy "Authenticated users can upload images"
on storage.objects for insert to authenticated with check (bucket_id = 'products');

create policy "Users can view all images"
on storage.objects for select to public using (bucket_id = 'products');
```

Once these steps are done, **Sign Up** in the app and try generating an image!
