import { Exclude } from "class-transformer";
import { UUID } from "crypto";
import { Task } from "../../tasks/entities/task.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column({ type: "varchar", length: 128 })
  name: string;

  @Column({ type: "varchar", length: 128, unique: true })
  email: string;

  @Exclude()
  @Column({ type: "text" })
  password: string;

  @CreateDateColumn({ type: "timestamp without time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone" })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Array<Task>;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
