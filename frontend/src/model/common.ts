
export type ISODateString = string;
export interface BaseEntity {
    id: string;
    updatedAt: ISODateString;
}

export type PartialEntity<T extends BaseEntity, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateEntity<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export type UpdateEntity<T extends BaseEntity> = Partial<Omit<T, keyof BaseEntity>> & Pick<T, 'id'>;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NullableOptional<T> = T | null | undefined; 