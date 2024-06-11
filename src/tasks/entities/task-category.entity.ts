import { UUID } from "crypto";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type Category = "home" | "work" | "personal" | "shopping";

@Entity()
export class TaskCategory {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column({ type: "varchar", length: "64", unique: true })
  title: Category;

  @CreateDateColumn({ type: "timestamp without time zone" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone" })
  public updatedAt?: Date;
}
