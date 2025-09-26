export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function convertKeysToSnakeCase(obj: unknown): unknown {
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const record = obj as Record<string, unknown>;
    const newObj: Record<string, unknown> = {};

    for (const key of Object.keys(record)) {
      const value = record[key];

      if (
        key === 'meta' &&
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        const meta = value as Record<string, unknown>;
        const timestamp = meta.timestamp;
        newObj[key] = {
          ...meta,
          timestamp: timestamp instanceof Date ? timestamp.toISOString() : timestamp,
        };
        continue;
      }

      if (value instanceof Date) {
        newObj[camelToSnakeCase(key)] = value.toISOString();
      } else if (Array.isArray(value)) {
        newObj[camelToSnakeCase(key)] = value.map((item) => convertKeysToSnakeCase(item));
      } else if (value !== null && typeof value === 'object') {
        newObj[camelToSnakeCase(key)] = convertKeysToSnakeCase(value);
      } else {
        newObj[camelToSnakeCase(key)] = value;
      }
    }

    return newObj;
  }

  return obj;
}
