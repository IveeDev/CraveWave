const CUISINE_EMOJIS: [keyword: string, emoji: string][] = [
  ["burger", "🍔"],
  ["pizza", "🍕"],
  ["asian", "🍜"],
  ["ramen", "🍜"],
  ["sushi", "🍣"],
  ["chicken", "🍗"],
  ["grill", "🍖"],
  ["bbq", "🍖"],
  ["rice", "🍚"],
  ["jollof", "🍚"],
  ["salad", "🥗"],
  ["vegan", "🥗"],
  ["dessert", "🍰"],
  ["sweet", "🍰"],
  ["drink", "🥤"],
  ["shake", "🥤"],
  ["coffee", "☕"],
  ["breakfast", "🥞"],
  ["seafood", "🦐"],
  ["taco", "🌮"],
  ["mexican", "🌮"],
  ["african", "🍲"],
  ["nigerian", "🍲"],
];

export function getCuisineEmoji(name: string) {
  const lower = name.toLowerCase();
  const match = CUISINE_EMOJIS.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : "🍽️";
}
