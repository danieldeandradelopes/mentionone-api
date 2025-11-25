export function cleanObject(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== null && value !== undefined && value !== false && value !== ""
    )
  );
}
