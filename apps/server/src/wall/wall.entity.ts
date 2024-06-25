import { Base } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Wall extends Base {
    @Column({ type: "varchar", name: "name" })
    name: string;
    @Column({ type: "varchar", name: "img_url" })
    img: string;
    @Column({ type: "varchar", name: "gym_id" })
    gymId: number;
}