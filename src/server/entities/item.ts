import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Position } from "./position";

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    //
    @Column("text")
    partNumber: string;
    //
    @Column("text")
    description: string;
    //
    @Column("double precision")
    cost: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Position, (position) => position.item)
    position: Position[];
}