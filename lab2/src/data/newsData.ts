export const newsData = Array.from({ length: 50 }).map((_, index) => ({
  id: index.toString(),
  title: `Новина #${index + 1}: Важлива подія`,
  description: `Lorem ipsum dolor sit amet. ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  image: `https://picsum.photos/seed/${index + 1}/400/200`
}));