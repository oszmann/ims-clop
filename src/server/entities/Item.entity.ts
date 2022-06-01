import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    //
    @Column("text")
    description: string | null;
    //
    @Column("double precision")
    cost: number | null;
}