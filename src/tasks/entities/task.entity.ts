import { UUID } from "crypto";
import { User } from "../../users/entities/user.entity";
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

  @Column({ type: "timestamp without time zone", nullable: true })
  dueDate: Date;

  @Column({ type: "bool", default: false })
  completed: boolean;

  @Column({ type: "varchar", length: 36, nullable: true })
  priotity: TaskPriority;

  @Column({ type: "float", nullable: true })
  evaluation: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => TaskCategory, { cascade: true, nullable: true })
  @JoinTable()
  categories: Array<TaskCategory>;

  @CreateDateColumn({ type: "timestamp without time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone" })
  updatedAt?: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}

export enum TaskPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CIRTICAL = "critical",
}
