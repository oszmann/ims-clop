import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Item } from "./item";
import { Location } from "./location";

/**
 * Connecting the many-to-many relation of items and locations with a stored amount
 */
@Entity()
export class Position {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    itemId!: string;

    @Column("text")
    locationId!: string;

    @Column("int")
    amount!: number;

    @Column("int")
    position!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Item, item => item.position)
    item: Item;

    @ManyToOne(() => Location, location => location.position)
    location: Location;
}
