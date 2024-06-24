import { Base } from "src/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Gym extends Base {
    @Column({ type: "varchar", name: "name" })
    name: string;
    @Column({ type: "varchar", name: "address" })
    address: string;
    @Column({ type: "double", name: "latitude" })
    latitude: number;
    @Column({ type: "double", name: "longitude" })
    longitude: number;
    @Column({ type: "varchar", name: "phone" })
    phone: string;
    @Column({ type: "varchar", name: "business_hour" })
    businessHour: string;

}