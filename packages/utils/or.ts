
export function or(predicate: boolean, left: () => void, right: () => void): void {
    predicate ? left() : right();
}