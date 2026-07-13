
-- Restrict notifications insert: only user themselves or service role
DROP POLICY IF EXISTS "Anyone auth can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications for self" ON public.notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.friendships f
    WHERE f.requester_id = auth.uid() AND f.addressee_id = user_id
  ));

-- Revoke execute from public/anon/authenticated on security definer functions
REVOKE ALL ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
