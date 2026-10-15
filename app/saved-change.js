// Keep the live model consistent with a rejected write. Callers must render afterwards.
export function saveFieldChange(target, key, value, save) {
  const existed = Object.hasOwn(target, key), previous = target[key];
  target[key] = value;
  try {
    if (save() === false) throw Error('save-rejected');
    return true;
  } catch {
    if (existed) target[key] = previous;
    else delete target[key];
    return false;
  }
}
