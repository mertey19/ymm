'use client';
import type { ImageLoaderProps } from 'next/image';
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!['/images/hero.webp', '/images/about.webp'].includes(src)) return src;
  const size = [480, 768, 1080, 1400].find((candidate) => candidate >= width) || 1400;
  return src.replace('.webp', `-${size}.webp`);
}
