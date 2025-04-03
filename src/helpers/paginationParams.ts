const MAX_POSTS_PER_PAGE = 50;

export default function paginationParams(page?: number, perPage?: number) {
  // Validate pagination parameters
  const validatedPerPage = Math.min(
    Math.max(5, perPage || 1),
    MAX_POSTS_PER_PAGE
  );
  const validatedPage = Math.max(1, page || 1);

  const skip = (validatedPage - 1) * validatedPerPage;
  const take = validatedPerPage;

  return { skip, take };
}
