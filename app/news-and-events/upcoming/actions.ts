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

  const strippedPhone = phone.replace(/[\s\-().]/g, '');

  const errors: Record<string, string> = {};
  if (!name || name.trim().length < 2) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
  if (!strippedPhone || !/^\+[1-9]\d{7,14}$/.test(strippedPhone)) {
    errors.phone = 'Please include country code, e.g. +961 71 234 567';
  }
  if (!eventId) errors.eventId = 'Event ID is missing';
  if (numberOfGuests < 1 || numberOfGuests > 10) errors.numberOfGuests = 'Guest count must be 1-10';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Please fix the errors below.', errors };
  }

  try {
    await registerForEvent(eventId, {
      name: name.trim().replace(/\s+/g, ' '),
      email: email.trim(),
      phone: strippedPhone,
      numberOfGuests,
    });
    return {
      success: true,
      message: 'You have been registered successfully! A confirmation email has been sent to your inbox.',
    };
  } catch (error: any) {
    // ApiError stores the server message in details.message, not in error.message
    const message = error?.details?.message || error?.message || '';
    if (message.includes('already registered')) {
      return { success: false, message: 'You have already registered for this event.' };
    }
    if (message.includes('maximum capacity') || message.includes('EVENT_FULL')) {
      return { success: false, message: 'Sorry, this event has reached maximum capacity.' };
    }
    if (message.includes('past events')) {
      return { success: false, message: 'Registration is no longer available for this event.' };
    }
    if (message.includes('unpublished')) {
      return { success: false, message: 'This event is not currently accepting registrations.' };
    }
    return { success: false, message: 'Registration failed. Please try again later.' };
  }
}
