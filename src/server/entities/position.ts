import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item";
import { Location } from "./location";

/**
 * Connecting the many-to-many relation of items and locations with a stored amount
 */
@Entity()
export class Position {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    itemId!: string;

    @Column("text")
    locationId!: string;

    @Column("int")
    amount!: number;

    @ManyToOne(() => Item, item => item.position)
    item: Item;

    @ManyToOne(() => Location, location => location.position)
    location: Location;
}
