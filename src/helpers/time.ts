export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/ // Regular expression to match 'HH:mm' format

  return timeRegex.test(time)
}
