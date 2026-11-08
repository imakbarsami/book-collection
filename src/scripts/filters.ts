import type { Book } from "../types/book.js";

export interface FilterState {
    minPrice: number | "";
    maxPrice: number | "";
}

export function searchBooks(books: Book[], query: string): Book[] {
    const trimmed = query.trim();
    if (!trimmed) {
        return books.slice();
    }

    const term = trimmed.toLowerCase();

    return books.filter((book) => {
        const name = book.name.toLowerCase().includes(term);
        const category = book.category.toLowerCase().includes(term);
        const author = book.author.toLowerCase().includes(term);
        return name || category || author;
    });
}

export function filterBooks(
    books: Book[],
    filters: FilterState
): Book[] {
    return books.filter((book) => {
        if (filters.minPrice !== "" && book.price < Number(filters.minPrice)) {
            return false;
        }
        if (filters.maxPrice !== "" && book.price > Number(filters.maxPrice)) {
            return false;
        }
        return true;
    });
}

export function isFilterEmpty(filters: FilterState): boolean {
    return filters.minPrice === "" && filters.maxPrice === "";
}

export function resetFilters(): FilterState {
    return {
        minPrice: "",
        maxPrice: "",
    };
}
