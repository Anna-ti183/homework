//1️⃣ PaginatedOutput — ядро метаданных пагинации - Это универсальный тип для метаданных пагинации  - Используется везде, где нужна пагинация (блоги, пост)

export type PaginatedOutput = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
};