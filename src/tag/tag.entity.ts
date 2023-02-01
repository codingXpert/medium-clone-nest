import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name:'tags'})
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}