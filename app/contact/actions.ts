'use server';

import { submitContactForm } from '@/lib/api/contact';

interface ContactFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Basic validation
  const errors: Record<string, string> = {};
  if (!firstName || firstName.trim().length < 2) errors.firstName = 'First name is required (min 2 characters)';
  if (!lastName || lastName.trim().length < 2) errors.lastName = 'Last name is required (min 2 characters)';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
  if (!message || message.trim().length < 10) errors.message = 'Message must be at least 10 characters';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Please fix the errors below.', errors };
  }

  try {
    await submitContactForm({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    return { success: true, message: 'Thank you! Your message has been sent successfully.' };
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }
}
