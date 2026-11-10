# Supabase Auth and comments setup

This frontend is static HTML/JavaScript. It uses Supabase Auth in the browser and the existing Render API for announcements. Comments are stored directly in Supabase and protected by RLS.

## Configure Supabase

1. In Supabase SQL Editor, run `supabase-auth-comments.sql`.
2. Put the Project URL and the publishable/anon key in `supabase-config.js`. Never put a service-role key in this file.
3. In Supabase Authentication settings, enable email/password sign-in and set the site URL and allowed redirect URLs to the GitHub Pages site.
4. Enable Realtime for `public.comments` in Database > Publications if live comment updates are wanted. Initial loads work without Realtime.

New Auth accounts get the `member` role and can comment. Once a council officer has created and confirmed an account, promote it from the SQL Editor using the example at the bottom of `supabase-auth-comments.sql`. The browser only displays the announcement composer for officers, and the Render API independently checks the profile role before allowing announcement creation, image upload, or deletion.

To link an existing SSC directory record to an Auth login, run the updated `supabase-auth-comments.sql` in the Supabase SQL Editor and deploy the `ssc-backend-push` changes to Render. The member signs in, submits their SSC ID from the dashboard, and an officer verifies and approves the request. Linking does not grant the officer role; assign `officer` separately only to verified council accounts using the SQL example at the bottom of the SQL file.

## Deploy

Push the frontend changes to `main` for GitHub Pages and the backend changes to `main` for Render. Render must have `SUPABASE_URL` and `SUPABASE_KEY` configured; keep its service key server-side. Existing SSC ID-only records are not Supabase Auth accounts, so users must create an email/password account and confirm their email before signing in. They can then request a link to their existing SSC ID record for officer review.
