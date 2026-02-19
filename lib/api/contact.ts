import { apiPost } from './client';
import type { ApiContactSubmission } from './types';

export async function submitContactForm(data: ApiContactSubmission): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/contact-submissions', data);
}
