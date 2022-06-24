import { Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("nested-set")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text")
    description: string;

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;
}
