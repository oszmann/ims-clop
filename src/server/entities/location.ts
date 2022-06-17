import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./position";

@Entity()
export class Location extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { nullable: true })
    warehouse: string;

    // @Column("int")
    // row: number;

    @Column("int")
    rack: number;

    @Column("int")
    shelf: number;

    @OneToMany(() => Position, position => position.location)
    position: Position[];
}
