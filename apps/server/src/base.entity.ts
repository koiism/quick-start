import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Base {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn({ name: "created_at", type: "timestamp", update: false })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;
    @Column({ name: "deleted_at", type: "timestamp" })
    deletedAt?: Date;
}