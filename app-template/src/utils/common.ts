export function isValidUuid(uuid: string): boolean {
  return uuid.length == 36;
}

export function isValidName(name: string): boolean {
  return name.length > 3;
}
