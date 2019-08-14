export function profileIdFromUrl(url: string) {
  return url.match(/([0-9]+)/)![0];
}

export function feetInchesToInches(height: string) {
  const [feet, inches] = height.split("-");
  return 12 * +feet + +inches;
}
