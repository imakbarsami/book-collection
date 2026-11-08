import type { Book } from "../types/book.js";

export type SortKey = "price" | "page" | null;
export type SortDir = "asc" | "desc" | null;

export interface SortState {
    key: SortKey;
    dir: SortDir;
}

export const defaultSort: SortState = { key: null, dir: null };

export function cycleSort(current: SortState, key: SortKey): SortState {
    if (current.key !== key) {
        return { key, dir: "asc" };
    }

    if (current.dir === "asc") {
        return { key, dir: "desc" };
    }

    return { key: null, dir: null };
}

export function sortBooks(books: Book[], sort: SortState): Book[] {
    const result = books.slice();

    if (!sort.key || !sort.dir) {
        return result;
    }

    const key = sort.key as "price" | "page";

    result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
        return 0;
    });

    return result;
}
