/**
 * Converts a title and ID into a URL-friendly slug
 * @param title - The title to slugify
 * @param id - The ID to append
 * @returns A slug in the format: "title-slug-id"
 */
export function slugify(title: string, id: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    id
  );
}

/**
 * Extracts the ID from a slug (assumes ID is after the last dash)
 * @param slug - The slug to extract ID from
 * @returns The extracted ID
 */
export function extractIdFromSlug(slug: string): string {
  return slug.split('-').pop() || slug;
}
