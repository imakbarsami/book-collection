import type { Book } from "../types/book.js";
import type { FilterState } from "./filters.js";
import type { SortState } from "./pagination.js";
import { formatBDT, formatNumber } from "./utils.js";

const app = document.getElementById("app")!;

let searchInput: HTMLInputElement | null = null;
let filterInputs: Record<string, HTMLInputElement> = {};
let resetBtn: HTMLButtonElement | null = null;

export interface RenderDeps {
    onSearchChange: (query: string) => void;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onResetFilters: () => void;
    onSortChange: (key: "price" | "page") => void;
    onPageChange: (page: number) => void;
}

export function initShell(deps: RenderDeps): void {
    app.innerHTML = `
        <header class="header" aria-label="Site header">
            <h1 class="site-title">Muhammad Sami's Book Collection</h1>
            <p class="site-subtitle">A personal archive of books I've collected and read.</p>
        </header>

        <section class="stats" aria-label="Collection summary">
            <div class="stat-card" aria-label="Total books">
                <p class="stat-label">Total Books</p>
                <p class="stat-value" id="stat-total-books">0</p>
            </div>
            <div class="stat-card" aria-label="Total price">
                <p class="stat-label">Total Price</p>
                <p class="stat-value" id="stat-total-price">0 TK</p>
            </div>
            <div class="stat-card" aria-label="Total pages">
                <p class="stat-label">Total Pages</p>
                <p class="stat-value" id="stat-total-pages">0</p>
            </div>
        </section>

        <section class="controls rounded-2xl" aria-label="Search and filters">
            <div class="search-wrapper" aria-label="Search books">
                <svg class="search-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                    type="search"
                    id="search-input"
                    class="search-input"
                    placeholder="Search by title, author, or category…"
                    aria-label="Search books"
                />
            </div>
            <div class="price-filters">
                <div class="filter-field">
                    <label class="filter-label" for="filter-min-price">Min Price</label>
                    <input
                        type="number"
                        id="filter-min-price"
                        class="filter-input"
                        placeholder="Min"
                        aria-label="Minimum price filter"
                    />
                </div>
                <div class="filter-field">
                    <label class="filter-label" for="filter-max-price">Max Price</label>
                    <input
                        type="number"
                        id="filter-max-price"
                        class="filter-input"
                        placeholder="Max"
                        aria-label="Maximum price filter"
                    />
                </div>
                <button
                    type="button"
                    id="reset-filters"
                    class="reset-filters"
                    aria-label="Clear all filters"
                >
                    Clear filters
                </button>
            </div>
        </section>

        <section class="table-section" aria-label="Book collection">
            <div class="table-wrapper" id="table-wrapper">
                <table class="table" id="books-table">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 70px;" aria-label="Book image">Image</th>
                            <th scope="col" class="sortable" data-sort="name" aria-label="Name" aria-sort="none">Name</th>
                            <th scope="col" class="sortable" data-sort="category" aria-label="Category" aria-sort="none">Category</th>
                            <th scope="col" class="sortable" data-sort="author" aria-label="Author" aria-sort="none">Author</th>
                            <th scope="col" class="sortable" data-sort="price" aria-label="Price" aria-sort="none">Price</th>
                            <th scope="col" class="sortable" data-sort="page" aria-label="Pages" aria-sort="none">Pages</th>
                        </tr>
                    </thead>
                    <tbody id="books-table-body"></tbody>
                </table>
                <div id="empty-state" class="empty-state" role="status" aria-live="polite" style="display:none;">
                    <h2 class="empty-title">No matching books</h2>
                    <p class="empty-desc">Try adjusting your search or price filter.</p>
                </div>
            </div>
        </section>

        <nav class="pagination" aria-label="Pagination">
            <p class="pagination-range" id="pagination-range">Showing 0 of 0 books</p>
            <div class="pagination-controls" id="pagination-controls"></div>
        </nav>

        <footer class="footer" aria-label="Site footer">
            <p class="footer-text">
                Designed &amp; built by
                <a
                    href="https://github.com/imakbarsami"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                >
                    @imakbarsami
                </a>
            </p>
        </footer>
    `;

    searchInput = document.getElementById("search-input") as HTMLInputElement;
    resetBtn = document.getElementById("reset-filters") as HTMLButtonElement;

    filterInputs = {
        minPrice: document.getElementById("filter-min-price") as HTMLInputElement,
        maxPrice: document.getElementById("filter-max-price") as HTMLInputElement,
    };

    searchInput.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        deps.onSearchChange(target.value);
    });

    Object.entries(filterInputs).forEach(([key, input]) => {
        input.addEventListener("input", (e) => {
            const target = e.target as HTMLInputElement;
            deps.onFilterChange(key as keyof FilterState, target.value);
        });
    });

    resetBtn.addEventListener("click", () => {
        deps.onResetFilters();
    });

    const sortableHeaders = app.querySelectorAll<HTMLElement>("th.sortable");
    sortableHeaders.forEach((header) => {
        const sortKey = header.dataset.sort;
        if (!sortKey || (sortKey !== "price" && sortKey !== "page")) {
            return;
        }
        header.addEventListener("click", () => {
            deps.onSortChange(sortKey as "price" | "page");
        });
    });
}

export function renderStats(books: Book[]): void {
    const totalBooks = books.length;
    const totalPrice = books.reduce((acc, b) => acc + b.price, 0);
    const totalPages = books.reduce((acc, b) => acc + b.page, 0);

    const totalBooksEl = document.getElementById("stat-total-books");
    const totalPriceEl = document.getElementById("stat-total-price");
    const totalPagesEl = document.getElementById("stat-total-pages");

    if (totalBooksEl) totalBooksEl.textContent = formatNumber(totalBooks);
    if (totalPriceEl) totalPriceEl.textContent = formatBDT(totalPrice);
    if (totalPagesEl) totalPagesEl.textContent = formatNumber(totalPages);
}

function createSortIndicator(active: boolean, dir: SortState["dir"]): string {
    if (!active) return `<span class="sort-indicator" aria-hidden="true"></span>`;
    const arrow = dir === "asc" ? "↓" : "↑";
    return `<span class="sort-indicator active" aria-hidden="true">${arrow}</span>`;
}

export function renderTable(books: Book[], sort: SortState): void {
    const tbody = document.getElementById("books-table-body");
    const emptyState = document.getElementById("empty-state");
    const table = document.getElementById("books-table");

    if (!tbody || !emptyState || !table) return;

    const headers = table.querySelectorAll<HTMLElement>("th.sortable");
    headers.forEach((header) => {
        const key = header.dataset.sort;
        if (!key) return;

        const isActive = sort.key === key;
        header.classList.toggle("active", isActive);
        header.setAttribute(
            "aria-sort",
            isActive ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
        );

        const existing = header.querySelector(".sort-indicator");
        if (existing) {
            existing.outerHTML = createSortIndicator(isActive, sort.dir);
        } else {
            header.insertAdjacentHTML("beforeend", createSortIndicator(isActive, sort.dir));
        }
    });

    tbody.innerHTML = "";

    if (books.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    table.style.display = "table";
    emptyState.style.display = "none";

    books.forEach((book) => {
        const row = document.createElement("tr");
        const priceFormatted = formatBDT(book.price);
        const pagesFormatted = formatNumber(book.page);
        const initial = book.name.charAt(0);

        row.innerHTML = `
            <td class="book-cell">
                <img
                    src="${book.image}"
                    alt="Cover of ${escapeHtml(book.name)}"
                    class="cover"
                    onerror="handleCoverError(this)"
                />
                <span class="cover fallback cover-fallback" style="display:none;">${escapeHtml(initial)}</span>
            </td>
            <td>
                <p class="book-title">${escapeHtml(book.name)}</p>
            </td>
            <td>
                <p class="book-category">${escapeHtml(book.category)}</p>
            </td>
            <td>
                <p class="book-author">${escapeHtml(book.author)}</p>
            </td>
            <td>
                <p class="book-price">${priceFormatted}</p>
            </td>
            <td>
                <p class="book-pages">${pagesFormatted}</p>
            </td>
        `;

        tbody.appendChild(row);
    });
}

export function renderPagination(
    currentPage: number,
    totalPages: number,
    start: number,
    end: number,
    total: number,
    onPrev: (page: number) => void,
    onPage: (page: number) => void,
    onNext: (page: number) => void
): void {
    const rangeEl = document.getElementById("pagination-range");
    const controlsEl = document.getElementById("pagination-controls");

    if (!rangeEl || !controlsEl) return;

    rangeEl.textContent =
        total === 0
            ? "No matching books"
            : `Showing ${start}–${end} of ${total} books`;

    controlsEl.innerHTML = "";

    const pageCount = Math.max(1, totalPages);

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "pagination-btn";
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.setAttribute("aria-label", "Previous page");
    prevBtn.setAttribute("aria-disabled", String(currentPage === 1));
    prevBtn.addEventListener("click", () => onPrev(currentPage - 1));
    controlsEl.appendChild(prevBtn);

    const visiblePages = getVisiblePages(currentPage, pageCount);

    visiblePages.forEach((item) => {
        if (item === "ellipsis") {
            const ellipsis = document.createElement("span");
            ellipsis.className = "pagination-ellipsis";
            ellipsis.textContent = "…";
            ellipsis.setAttribute("aria-hidden", "true");
            controlsEl.appendChild(ellipsis);
            return;
        }

        const pageBtn = document.createElement("button");
        pageBtn.type = "button";
        pageBtn.className = `pagination-page${item === currentPage ? " active" : ""}`;
        pageBtn.textContent = String(item);
        pageBtn.setAttribute("aria-label", `Page ${item}`);
        pageBtn.setAttribute("aria-current", item === currentPage ? "true" : "false");
        pageBtn.addEventListener("click", () => onPage(item));
        controlsEl.appendChild(pageBtn);
    });

    const mobileInfo = document.createElement("span");
    mobileInfo.className = "pagination-mobile-info";
    mobileInfo.textContent = pageCount > 1 ? `${currentPage} / ${pageCount}` : `1 / 1`;
    mobileInfo.setAttribute("aria-label", `Page ${currentPage} of ${pageCount}`);
    controlsEl.appendChild(mobileInfo);

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "pagination-btn";
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === pageCount || pageCount === 0;
    nextBtn.setAttribute("aria-label", "Next page");
    nextBtn.setAttribute("aria-disabled", String(nextBtn.disabled));
    nextBtn.addEventListener("click", () => onNext(currentPage + 1));
    controlsEl.appendChild(nextBtn);
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const alwaysShow = [1, total];
    const nearby = [current - 1, current, current + 1].filter(
        (p) => p > 1 && p < total
    );

    const showSet = new Set([...alwaysShow, ...nearby]);
    const sorted = Array.from(showSet).sort((a, b) => a - b);

    sorted.forEach((page, idx) => {
        if (idx > 0) {
            const prev = sorted[idx - 1];
            if (typeof prev === "number" && page - prev > 2) {
                pages.push("ellipsis");
            } else if (typeof prev === "number" && page - prev === 2) {
                pages.push(prev + 1);
            }
        }
        if (idx === 0) {
            pages.push(page);
        } else {
            pages.push(page);
        }
    });

    return pages;
}

export function setSearchInputValue(value: string): void {
    if (searchInput) {
        searchInput.value = value;
    }
}

export function setFilterInputValues(filters: FilterState): void {
    filterInputs.minPrice!.value = String(filters.minPrice);
    filterInputs.maxPrice!.value = String(filters.maxPrice);
}

export function resetFilterInputs(): void {
    filterInputs.minPrice!.value = "";
    filterInputs.maxPrice!.value = "";
}

function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

(window as any).handleCoverError = function (img: HTMLImageElement): void {
    const fallback = img.parentElement?.querySelector(".cover-fallback");
    if (fallback) {
        img.style.display = "none";
        (fallback as HTMLElement).style.display = "block";
    }
};
