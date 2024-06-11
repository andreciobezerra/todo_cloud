import { UUID } from "crypto";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskCategory } from "./task-category.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column({ type: "varchar", length: 128 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "timestamp without time zone" })
  dueDate: Date;

  @Column({ type: "bool" })
  completed: boolean;

  @Column({ type: "varchar", length: 36 })
  priotity: TaskPriority;

  @Column({ type: "float" })
  evaluation: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => TaskCategory, (category) => category.tasks, { cascade: true })
  @JoinTable()
  categories: Array<TaskCategory>;

  @CreateDateColumn({ type: "timestamp without time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone" })
  updatedAt?: Date;
}

export enum TaskPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CIRTICAL = "critical",
}
