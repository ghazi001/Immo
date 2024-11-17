interface Row {
  desc: string;
  min: number;
  moy: number;
  max: number;
}

export function subtotalMin(items: readonly Row[]) {
  return items.map(({ min }) => min).reduce((sum, i) => sum + i, 0);
}
export function subtotalMoy(items: readonly Row[]) {
  return items.map(({ moy }) => moy).reduce((sum, i) => sum + i, 0);
}
export function subtotalMax(items: readonly Row[]) {
  return items.map(({ max }) => max).reduce((sum, i) => sum + i, 0);
}
