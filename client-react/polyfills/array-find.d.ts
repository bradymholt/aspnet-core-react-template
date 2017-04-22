interface Array<T> {
    find(predicate: (search: T) => boolean): T;
}
