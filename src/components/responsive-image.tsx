// Prepared local variants work in both Next and the current Worker runtime.
export function ResponsiveImage({
  name,
  alt,
  sizes,
  priority = false,
}: {
  name: 'hero' | 'about';
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-encoded WebP srcset; no runtime optimizer needed.
    <img
      src={`/images/${name}-1400.webp`}
      srcSet={[480, 768, 1080, 1400]
        .map(
          (width) =>
            `/images/${name}-${width}.webp ${name === 'about' && width === 1400 ? 1280 : width}w`,
        )
        .join(', ')}
      width={name === 'hero' ? 1400 : 1280}
      height={name === 'hero' ? 1750 : 854}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
