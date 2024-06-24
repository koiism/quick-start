import { BaseEntity } from 'src/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @Column({ type: "varchar", name: "open_id" })
    openId: string;
    @Column({ type: "varchar", name: "union_id" })
    unionId: string;
    @Column({ type: "varchar", name: "user_name" })
    userName: string;
    @Column({ type: "varchar", name: "avatar_url" })
    avatarUrl: string;
}