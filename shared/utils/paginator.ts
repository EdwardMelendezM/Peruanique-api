export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}

export async function paginate<T>(
  model: any,
  args: any = {},
  options: { page: number; limit: number }
): Promise<PaginatedResult<T>> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({
      ...args,
      skip,
      take: limit,
    }),
    model.count({ where: args.where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      last_page: Math.ceil(total / limit),
      limit
    },
  };
}
