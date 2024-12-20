type Query<F extends Record<string, unknown>> = {
  page?: number;
  limit?: number;
} & F;

type Callback<
  F extends Record<string, unknown>,
  R extends Record<string, unknown>,
> = (filter: Omit<Query<F>, 'page' | 'limit'>) => R;

export const withPagination = <
  F extends Record<string, unknown>,
  R extends Record<string, unknown>,
>(
  query: Query<F>,
  cb: Callback<F, R>,
): { skip: number; limit: number; filter: R } => {
  const { page = 1, limit = 10, ...rest } = query;
  const skip = (page - 1) * limit;
  return { skip, limit, filter: cb(rest) };
};
