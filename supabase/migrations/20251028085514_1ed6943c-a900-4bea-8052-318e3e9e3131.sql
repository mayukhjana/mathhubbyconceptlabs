-- Create ai_chat_history table for MathHub AI
CREATE TABLE public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  has_image boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history"
ON public.ai_chat_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history"
ON public.ai_chat_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat history"
ON public.ai_chat_history
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
ON public.support_tickets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
ON public.support_tickets
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create user_ai_doubts table for tracking daily AI usage
CREATE TABLE public.user_ai_doubts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_used integer DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_ai_doubts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI usage"
ON public.user_ai_doubts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage"
ON public.user_ai_doubts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update AI usage"
ON public.user_ai_doubts
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all AI usage"
ON public.user_ai_doubts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add validation constraints
ALTER TABLE public.support_tickets ADD CONSTRAINT subject_not_empty CHECK (length(trim(subject)) > 0);
ALTER TABLE public.support_tickets ADD CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0);
ALTER TABLE public.ai_chat_history ADD CONSTRAINT question_not_empty CHECK (length(trim(question)) > 0);
ALTER TABLE public.ai_chat_history ADD CONSTRAINT answer_not_empty CHECK (length(trim(answer)) > 0);

-- Create trigger for support tickets updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();