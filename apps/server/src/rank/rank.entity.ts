import { Base } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Rank extends Base {
    @Column({ type: "bigint", name: "user_id" })
    userId: number;
    @Column({ type: "int", name: "exp" })
    exp: number;
    @Column({ type: "int", name: "source" })
    source: number;
}