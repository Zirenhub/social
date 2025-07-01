export default function formatCount(count: number, content: string) {
  if (count === 0) {
    return content;
  }
  if (count < 1000) {
    return `${count}`;
  }
  if (count >= 1000 && count < 10000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return `${Math.floor(count / 1000)}k`;
}
