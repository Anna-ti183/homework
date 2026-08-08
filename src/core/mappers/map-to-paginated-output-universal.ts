
// 3️⃣ универсальный маппер: списка с пагинацией: считает meta (page/pageSize/pageCount/totalCount)
// и мапит каждый элемент функцией mapItem в нужный data-элемент.
// Используется и blogs, posts — без дублирования кода пагинации.

export function mapToPaginatedOutputUniversal<TItem, TData>(
  items: TItem[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  mapItem: (item: TItem) => TData,
): { pagesCount: number; page: number; pageSize: number; totalCount: number; items: TData[] } {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: items.map(mapItem),
    };
}