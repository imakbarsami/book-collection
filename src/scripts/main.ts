import type { Book } from "../types/book.js";
import type { FilterState } from "./filters.js";
import type { SortState } from "./pagination.js";
import { books } from "../data/books.js";
import {
    searchBooks,
    filterBooks,
    resetFilters,
} from "./filters.js";
import {
    sortBooks,
    cycleSort,
    defaultSort,
} from "./pagination.js";
import { formatNumber } from "./utils.js";
import {
    initShell,
    renderStats,
    renderTable,
    renderPagination,
    setSearchInputValue,
    setFilterInputValues,
    resetFilterInputs,
} from "./renderBooks.js";

const PAGE_SIZE = 5;

// --- State ---
let state = {
    query: "",
    filters: resetFilters(),
    sort: { ...defaultSort },
    page: 1,
};

// --- Derived ---
function getSearched(): Book[] {
    return searchBooks(books, state.query);
}

function getFiltered(): Book[] {
    return filterBooks(getSearched(), state.filters);
}

function getSorted(): Book[] {
    return sortBooks(getFiltered(), state.sort);
}

interface PaginatedResult {
    items: Book[];
    total: number;
    totalPages: number;
    start: number;
    end: number;
}

function getPaginated(): PaginatedResult {
    const sorted = getSorted();
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    // Clamp page to valid range
    if (state.page > totalPages) {
        state.page = totalPages;
    }
    if (state.page < 1) {
        state.page = 1;
    }

    const start = (state.page - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    const items = sorted.slice(start, end);

    return { items, total, totalPages, start, end };
}

// --- Render ---
function render(): void {
    const { items, total, totalPages, start, end } = getPaginated();

    renderStats(books);
    renderTable(items, state.sort);
    renderPagination(
        state.page,
        totalPages,
        start + 1,
        end,
        total,
        handlePrevPage,
        handlePageChange,
        handleNextPage
    );
}

// --- Event handlers ---
function handleSearchChange(query: string): void {
    state.query = query;
    state.page = 1;
    render();
}

function handleFilterChange(key: keyof FilterState, value: string): void {
    state.filters = { ...state.filters, [key]: value };
    state.page = 1;
    render();
}

function handleResetFilters(): void {
    state.filters = resetFilters();
    state.page = 1;
    setFilterInputValues(state.filters);
    resetFilterInputs();
    render();
}

function handleSortChange(key: "price" | "page"): void {
    state.sort = cycleSort(state.sort, key);
    state.page = 1;
    render();
}

function handlePageChange(page: number): void {
    state.page = page;
    render();
}

function handlePrevPage(): void {
    handlePageChange(state.page - 1);
}

function handleNextPage(): void {
    handlePageChange(state.page + 1);
}

// --- Init ---
function init(): void {
    const debouncedSearch = (() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return (query: string) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                handleSearchChange(query);
            }, 300);
        };
    })();

    initShell({
        onSearchChange: debouncedSearch,
        onFilterChange: handleFilterChange,
        onResetFilters: handleResetFilters,
        onSortChange: handleSortChange,
        onPageChange: handlePageChange,
    });

    render();
}

init();
