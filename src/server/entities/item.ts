import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    //
    @Column("text")
    name: string;
    //
    @Column("text")
    description: string;
    //
    @Column("double precision")
    cost: number;
}