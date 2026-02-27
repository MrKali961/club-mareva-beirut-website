'use server';

import { registerForEvent } from '@/lib/api/events';

interface RegistrationFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitEventRegistration(
  _prevState: RegistrationFormState,
  formData: FormData,
): Promise<RegistrationFormState> {
  const eventId = formData.get('eventId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const numberOfGuests = parseInt(formData.get('numberOfGuests') as string, 10) || 1;

  const errors: Record<string, string> = {};
  if (!name || name.trim().length < 2) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
  if (!phone || phone.trim().length < 6) errors.phone = 'Valid phone number is required';
  if (!eventId) errors.eventId = 'Event ID is missing';
  if (numberOfGuests < 1 || numberOfGuests > 10) errors.numberOfGuests = 'Guest count must be 1-10';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Please fix the errors below.', errors };
  }

  try {
    await registerForEvent(eventId, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      numberOfGuests,
    });
    return {
      success: true,
      message: 'You have been registered successfully! A confirmation email has been sent to your inbox.',
    };
  } catch (error: any) {
    const message = error?.message || '';
    if (message.includes('already registered')) {
      return { success: false, message: 'You have already registered for this event.' };
    }
    if (message.includes('maximum capacity')) {
      return { success: false, message: 'Sorry, this event has reached maximum capacity.' };
    }
    return { success: false, message: 'Registration failed. Please try again later.' };
  }
}
