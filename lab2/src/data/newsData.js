export const newsData = Array.from({ length: 50 }).map((_, index) => ({
  id: index.toString(),
  title: `Новина #${index + 1}: Важлива подія`,
  description: `Це детальний опис новини під номером ${index + 1}. Тут знаходиться текст, який розкриває суть події та надає додаткову інформацію для користувача.`,
  image: `https://picsum.photos/seed/${index + 1}/400/200`
}));