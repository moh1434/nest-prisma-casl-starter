import { PaginatorDto } from './dto/paginator.normal.dto';

//
type PaginatorQueryReturn = Promise<{
  total: number;
  data: { [key in string]: any }[];
}>;

export type PaginationArgs = {
  skip: number;
  take: number;
};
type PaginatorQuery = (paginationArgs: PaginationArgs) => PaginatorQueryReturn;
//
type paginationResult<PaginatorQueryData> = Promise<{
  data: PaginatorQueryData;
  meta: {
    lastPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}>;
//

/**
 * @example
 *  const paginatorQuery = async (paginationArgs: PaginationArgs) => {
 *    const where = {
 *      authorId: id,
 *    };
 *    return {
 *      total: await this.prisma.post.count({ where }),
 *      data: await this.prisma.post.findMany({
 *        ...paginationArgs,
 *        where,
 *        select: PostService.select,
 *      }),
 *    };
 *  };
 *  const posts = await paginator<ReturnType<typeof paginatorQuery>>(
 *    paginatorQuery,
 *    paginatorDto,
 *  );
 */
export async function paginator<
  CurrentPaginatorQueryReturn extends PaginatorQueryReturn,
>(
  paginatorQuery: PaginatorQuery,
  paginatorDto: PaginatorDto,
): paginationResult<Awaited<CurrentPaginatorQueryReturn>['data']> {
  const page = Number(paginatorDto.page);
  const perPage = Number(paginatorDto.perPage);
  console.log(paginatorDto);
  const skip = page > 0 ? perPage * (page - 1) : 0;

  //Start: prisma query
  const totalAndData = await paginatorQuery({ skip, take: perPage });
  //End: prisma query

  const lastPage = Math.ceil(totalAndData['total'] / perPage);

  return {
    data: totalAndData['data'],
    meta: {
      lastPage,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  };
}
