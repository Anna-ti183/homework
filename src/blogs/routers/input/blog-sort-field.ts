//Определяет допустимые поля для сортировки блогов. 
// Используется в BlogQueryInput для ограничения, по каким полям клиент может сортировать.
//сортировка по createdAt

export enum BlogSortField {
  CreatedAt = 'createdAt',
  Name = 'name',
  Description = 'description'
} 