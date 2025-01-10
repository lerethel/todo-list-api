export default class Metadata<K extends object, V extends object> extends Map<
  K,
  V
> {
  update(key: K, value: Partial<V>) {
    return this.set(key, { ...this.get(key), ...value } as V);
  }
}
