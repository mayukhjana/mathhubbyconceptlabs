-- Create mentor_bookings table
CREATE TABLE public.mentor_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, completed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

-- Students can view their own bookings
CREATE POLICY "Students can view their own bookings"
ON public.mentor_bookings
FOR SELECT
USING (auth.uid() = student_id);

-- Students can create bookings
CREATE POLICY "Students can create bookings"
ON public.mentor_bookings
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Teachers can view their bookings
CREATE POLICY "Teachers can view their bookings"
ON public.mentor_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teachers
    WHERE teachers.id = mentor_bookings.teacher_id
    AND teachers.user_id = auth.uid()
  )
);

-- Teachers can update their bookings (accept/reject)
CREATE POLICY "Teachers can update their bookings"
ON public.mentor_bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.teachers
    WHERE teachers.id = mentor_bookings.teacher_id
    AND teachers.user_id = auth.uid()
  )
);

-- Trigger to update updated_at
CREATE TRIGGER update_mentor_bookings_updated_at
BEFORE UPDATE ON public.mentor_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();