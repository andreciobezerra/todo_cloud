import { UUID } from "crypto";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "./task.entity";

export type Category = "home" | "work" | "personal" | "shopping";

@Entity()
export class TaskCategory {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column({ type: "varchar", length: "64", unique: true })
  title: Category;

  @ManyToMany(() => Task, (task) => task.categories)
  tasks: Array<Task>;

  @CreateDateColumn({ type: "timestamp without time zone" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone" })
  public updatedAt?: Date;
}
