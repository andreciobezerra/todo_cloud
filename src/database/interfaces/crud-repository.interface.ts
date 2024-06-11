import { UUID } from "crypto";

type Timestamps = "createdAt" | "updatedAt";

export type PaginatedResult<T> = {
  data: Array<T>;
  total: number;
  page: number;
};

export interface ICrudRepository<T> {
  create(payload: Omit<T, "id" | Timestamps>): Promise<T | void> | T;
  findOneById(id: UUID, userId?: UUID): Promise<T | null>;
  findAll(userId?: UUID, page?: number): Promise<PaginatedResult<T>>;
  update(id: UUID, payload: Partial<T>, userId?: UUID): Promise<T>;
  delete(id: UUID, userId?: UUID): Promise<unknown>;
}
