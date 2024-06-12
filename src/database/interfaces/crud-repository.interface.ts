import { UUID } from "crypto";

type Timestamps = "createdAt" | "updatedAt";

export type PaginatedResult<T> = {
  data: Array<T>;
  total: number;
  page: number;
};

export interface ICrudRepository<T> {
  create(payload: Omit<T, "id" | Timestamps>): Promise<T | void> | T;
  findOneById(id: UUID): Promise<T | null>;
  findAll(page?: number, userId?: UUID): Promise<PaginatedResult<T>>;
  update(id: UUID, payload: Partial<T>): Promise<T>;
  delete(id: UUID): Promise<unknown>;
}
