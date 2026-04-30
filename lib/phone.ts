/**
 * Phone number formatting and normalization, powered by libphonenumber-js.
 * Supports all country codes; defaults to Lebanon (LB) when the user types a
 * local-format number without a country code.
 */

import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  type CountryCode,
} from 'libphonenumber-js';

const DEFAULT_COUNTRY: CountryCode = 'LB';

/**
 * Format a raw phone string for display in international form, e.g.
 *   "+96171234567" -> "+961 71 234 567"
 *   "+33612345678" -> "+33 6 12 34 56 78"
 * Returns the original string if it can't be parsed.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const parsed = parsePhoneNumberFromString(raw, DEFAULT_COUNTRY);
  if (!parsed) return raw;
  return parsed.formatInternational();
}

/**
 * Normalize any user input to canonical E.164, e.g.
 *   "03 71 72 73 74"        -> "+96171727374"   (default LB)
 *   "+961 71 234 567"       -> "+96171234567"
 *   "+33 6 12 34 56 78"     -> "+33612345678"
 *   "(415) 555-1234" + "US" -> "+14155551234"
 * Returns the original string if it can't be parsed.
 */
export function toRawPhone(
  phone: string | null | undefined,
  defaultCountry: CountryCode = DEFAULT_COUNTRY,
): string {
  if (!phone) return '';
  const parsed = parsePhoneNumberFromString(phone, defaultCountry);
  if (!parsed) return phone;
  return parsed.format('E.164');
}

/**
 * Validate a phone number for any country.
 */
export function isValidPhone(
  phone: string | null | undefined,
  defaultCountry: CountryCode = DEFAULT_COUNTRY,
): boolean {
  if (!phone) return false;
  return isValidPhoneNumber(phone, defaultCountry);
}

/**
 * Live-format phone input as the user types — international form.
 * Used for legacy plain-input fields. New forms should prefer
 * <PhoneInput /> from react-phone-number-input which has a country selector.
 */
export function formatPhoneInput(
  value: string,
  defaultCountry: CountryCode = DEFAULT_COUNTRY,
): string {
  if (!value) return '';
  const parsed = parsePhoneNumberFromString(value, defaultCountry);
  if (parsed) return parsed.formatInternational();
  return value;
}
