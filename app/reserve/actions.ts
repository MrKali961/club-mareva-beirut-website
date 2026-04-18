'use server';

import { submitReservation } from '@/lib/api/reservations';

interface ReserveFormState {
  success: boolean;
  message: string;
  confirmedName?: string;
  errors?: Record<string, string>;
}

export async function submitReserveForm(
  _prevState: ReserveFormState,
  formData: FormData,
): Promise<ReserveFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const rawPhone = (formData.get('phone') as string) ?? '';
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const numberOfGuests = Number(formData.get('numberOfGuests'));
  const specialRequests = formData.get('specialRequests') as string;
  const tableId = formData.get('tableId') as string;
  const durationMinutes = Number(formData.get('durationMinutes')) || undefined;
  const whatsappOptIn = formData.get('whatsappOptIn') === 'on';

  // Normalize phone to E.164 (strip spaces/dashes/parens) to match server validation.
  const phone = rawPhone.replace(/[\s\-().]/g, '');

  const errors: Record<string, string> = {};
  if (!name || name.trim().length < 2) errors.name = 'Name is required (min 2 characters)';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
  if (!phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
    errors.phone = 'Please include country code, e.g. +961 71 234 567';
  }
  if (!date) errors.date = 'Please select a date';
  if (!time) errors.time = 'Please select a time slot';
  if (!tableId) errors.tableId = 'Please select a table';
  if (!numberOfGuests || numberOfGuests < 1) errors.numberOfGuests = 'Number of guests is required';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Please fix the errors below.', errors };
  }

  // Verify reCAPTCHA v3 token
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const recaptchaToken = formData.get('recaptchaToken') as string;
    if (!recaptchaToken) {
      return { success: false, message: 'Security verification failed. Please refresh the page and try again.' };
    }

    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success || verifyData.score < 0.5) {
        return { success: false, message: 'Security verification failed. Please try again.' };
      }
    } catch {
      return { success: false, message: 'Security verification failed. Please try again.' };
    }
  }

  try {
    const result = await submitReservation({
      name: name.trim(),
      email: email.trim(),
      phone,
      date,
      time,
      durationMinutes,
      numberOfGuests,
      tableId,
      specialRequests: specialRequests?.trim() || undefined,
      whatsappOptIn,
    });
    return { success: true, message: result.confirmationMessage || 'Your reservation has been received.', confirmedName: result.name };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again or call us directly.';
    return { success: false, message: msg };
  }
}
