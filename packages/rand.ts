export default function rand<T>(s: any[] | string): T {
  const n = Math.round(Math.random() * (s.length - 1)); 
  return s[n];
}