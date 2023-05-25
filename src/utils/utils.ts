export function groupBy<
  K extends ObjectKey,
  TItem extends Record<K, ObjectKey>
>(items: TItem[], key: K): Record<ObjectKey, TItem[]> {
  return items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item]
    }),
    {} as Record<ObjectKey, TItem[]>
  );
}

type ObjectKey = string | number | symbol;
