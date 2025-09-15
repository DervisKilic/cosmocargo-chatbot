export type WithDocs<T, D extends string> = T & {
    _docs?: D;
};

export type WithExample<T, E extends string> = T & {
    _example?: E;
};

export type WithDocsAndExample<T, D extends string, E extends string> = WithDocs<WithExample<T, E>, D>;     