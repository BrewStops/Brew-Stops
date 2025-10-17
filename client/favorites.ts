const FAVORITES_KEY = "brewstop-favorites";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getFavorites(): string[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(cafeId: string): void {
  if (!isClient()) return;
  
  const favorites = getFavorites();
  if (!favorites.includes(cafeId)) {
    favorites.push(cafeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(cafeId: string): void {
  if (!isClient()) return;
  
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== cafeId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export function isFavorite(cafeId: string): boolean {
  if (!isClient()) return false;
  
  const favorites = getFavorites();
  return favorites.includes(cafeId);
}

export function toggleFavorite(cafeId: string): boolean {
  if (!isClient()) return false;
  
  if (isFavorite(cafeId)) {
    removeFavorite(cafeId);
    return false;
  } else {
    addFavorite(cafeId);
    return true;
  }
}
