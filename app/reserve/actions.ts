'use server';

import { submitReservation } from '@/lib/api/reservations';

interface ReserveFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitReserveForm(
  _prevState: ReserveFormState,
  formData: FormData,
): Promise<ReserveFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const numberOfGuests = Number(formData.get('numberOfGuests'));
  const specialRequests = formData.get('specialRequests') as string;

  const errors: Record<string, string> = {};
  if (!name || name.trim().length < 2) errors.name = 'Name is required (min 2 characters)';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
  if (!date) errors.date = 'Please select a date';
  if (!time) errors.time = 'Please select a time slot';
  if (!numberOfGuests || numberOfGuests < 1) errors.numberOfGuests = 'Number of guests is required';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Please fix the errors below.', errors };
  }

  try {
    const result = await submitReservation({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      date,
      time,
      numberOfGuests,
      specialRequests: specialRequests?.trim() || undefined,
    });
    return { success: true, message: result.confirmationMessage || 'Your reservation has been received.' };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again or call us directly.';
    return { success: false, message: msg };
  }
}
