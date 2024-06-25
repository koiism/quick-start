import { Base } from 'src/common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends Base {
    @Column({ type: "varchar", name: "open_id" })
    openId: string;
    @Column({ type: "varchar", name: "union_id" })
    unionId: string;
    @Column({ type: "varchar", name: "username" })
    userName: string;
    @Column({ type: "varchar", name: "avatar_url" })
    avatarUrl: string;
}