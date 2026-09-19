export function dataFilter(entity: Object, data: Object) {
  return Object.assign(
    entity,
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );
}