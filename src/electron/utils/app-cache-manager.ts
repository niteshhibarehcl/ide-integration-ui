/**
 * Description placeholder
 *
 * @export
 * @class AppCacheManager
 * @typedef {AppCacheManager}
 * @template K
 * @template V
 */
export class AppCacheManager<K, V> {
  private cache: Map<K, V>;

  /**
   * Initializes a new instance of the AppCacheManager class.
   */
  constructor() {
    this.cache = new Map<K, V>();
  }

  /**
   * Adds or updates an entry in the cache.
   *
   * @param {K} key The key of the cache entry.
   * @param {V} value The value of the cache entry.
   */
  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  /**
   * Retrieves a value from the cache by its key.
   *
   * @param {K} key The key of the cache entry.
   * @returns {(V | undefined)} The value associated with the key, or undefined if the key does not exist.
   */
  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  /**
   * Checks if a key exists in the cache.
   *
   * @param {K} key The key to check.
   * @returns {boolean} True if the key exists; otherwise, false.
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes an entry from the cache by its key.
   *
   * @param {K} key The key of the entry to delete.
   * @returns {boolean} True if the entry was removed; false if the key did not exist.
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the number of entries in the cache.
   *
   * @returns {number} The number of cache entries.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Retrieves all keys in the cache.
   *
   * @returns {K[]} An array of all keys in the cache.
   */
  keys(): K[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Retrieves all values in the cache.
   *
   * @returns {V[]} An array of all values in the cache.
   */
  values(): V[] {
    return Array.from(this.cache.values());
  }

  /**
   * Retrieves all key-value pairs in the cache.
   *
   * @returns {[K, V][]} An array of tuples representing key-value pairs in the cache.
   */
  entries(): [K, V][] {
    return Array.from(this.cache.entries());
  }
}
