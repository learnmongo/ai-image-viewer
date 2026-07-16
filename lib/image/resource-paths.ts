export function imageResourcePaths(id: string) {
  return {
    placeholder: `/resources/${id}-ph.webp`,
    grid: `/resources/${id}-grid.webp`,
    full: `/resources/${id}.jpg`,
  } as const;
}
