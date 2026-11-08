export function debounce<Args extends unknown[]>(
    func: (...args: Args) => void,
    wait: number
): (...args: Args) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Args): void => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export function formatBDT(value: number): string {
    return new Intl.NumberFormat("en-US").format(value) + " TK";
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
}

export function sumBy<T>(items: T[], key: keyof T): number {
    return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}
