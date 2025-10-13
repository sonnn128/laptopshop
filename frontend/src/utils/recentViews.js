const STORAGE_KEY = 'recentViews';
const MAX = 10;

export function pushView(product) {
  if (!product || !product.id) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let arr = raw ? JSON.parse(raw) : [];
    // remove existing
    arr = arr.filter(p => p.id !== product.id);
    arr.unshift(product);
    if (arr.length > MAX) arr = arr.slice(0, MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('recentViews push error', e);
  }
}

export function getRecentViews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export default { pushView, getRecentViews };
