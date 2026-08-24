import { query } from 'express-validator';
import { SortDirection } from '../types/sort-direction';

// Дефолтные значения пагинации/сортировки. Задаются через .default() в валидаторах,
// поэтому после валидации query всегда содержит корректные значения — отдельная
// функция "проставить дефолты" больше не нужна.
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export function paginationAndSortingValidation<T extends string>(
    sortFieldsEnum: Record<string, T>,

    
) {
    const allowedSortFields = Object.values(sortFieldsEnum);
    
    console.log('sortFieldsEnum:', sortFieldsEnum);
    console.log('Object.values:', Object.values(sortFieldsEnum));
    
    return [
        query('pageNumber')
            .default(DEFAULT_PAGE_NUMBER)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),

        query('pageSize')
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),

        query('sortBy')
            .default(Object.values(sortFieldsEnum)[0]) // Первое значение enum как дефолтное
            .isIn(allowedSortFields)
            .withMessage(
                `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
            ),

        query('sortDirection')
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(Object.values(SortDirection))
            .withMessage(
                `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
            ),

        query('searchNameTerm')
            .optional() //.optional()	Если параметра нет — пропускаем
            .isString()
            .withMessage('searchNameTerm must be a string')
            .trim(),

        query('searchLoginTerm')
            .optional()
            .isString()
            .withMessage('searchLoginTerm must be a string')
            .trim(),

        query('searchEmailTerm')
            .optional()
            .isString()
            .withMessage('searchEmailTerm must be a string')
            .trim(),

    ];
}