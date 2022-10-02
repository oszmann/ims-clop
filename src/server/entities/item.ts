import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
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

    @Column("int")
    minStock: number;

    @Column("text")
    category: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Position, position => position.item)
    position: Position[];
}
