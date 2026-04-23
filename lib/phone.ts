/**
 * Unified phone number formatting for Lebanese numbers.
 * Display format: +961 XX XXX XXX
 */

/**
 * Format a raw phone string for display: +961 XX XXX XXX
 * Returns the original string if it can't be parsed as a Lebanese number.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return ''

  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return raw

  let local: string
  if (digits.startsWith('961') && digits.length >= 11) {
    local = digits.slice(3)
  } else if (digits.startsWith('0') && digits.length >= 8) {
    local = digits.slice(1)
  } else if (digits.length === 8) {
    local = digits
  } else {
    return raw
  }

  if (local.length !== 8) return raw

  return `+961 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 8)}`
}

/**
 * Strip a formatted phone to digits-only with + prefix, for tel: hrefs.
 * e.g. "+961 01 123 123" -> "+96101123123"
 */
export function toRawPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.startsWith('961')) return `+${digits}`
  if (digits.startsWith('0') && digits.length >= 8) return `+961${digits.slice(1)}`
  if (digits.length === 8) return `+961${digits}`
  return phone
}

/**
 * Live-format phone input as the user types.
 * Auto-prepends +961 and inserts spaces: +961 XX XXX XXX
 */
export function formatPhoneInput(value: string): string {
  let digits = value.replace(/[^\d]/g, '')

  if (digits.startsWith('961')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)

  digits = digits.slice(0, 8)
  if (!digits) return ''

  let result = '+961 '
  if (digits.length <= 2) {
    result += digits
  } else if (digits.length <= 5) {
    result += digits.slice(0, 2) + ' ' + digits.slice(2)
  } else {
    result += digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5)
  }

  return result
}
