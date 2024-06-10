import { UUID } from "crypto";

type Timestamps = "createdAt" | "updatedAt";

export interface ICrudRepository<T> {
  create(payload: Omit<T, "id" | Timestamps>): Promise<T>;
  findOne(id: UUID): Promise<T | null>;
  findAll(page?: number): Promise<Array<T>>;
  update(id: UUID, payload: Partial<T>): Promise<T>;
  delete(id: UUID): Promise<T>;
}
