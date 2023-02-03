import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  
  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({select:false})   // false means we are not selecting the password & that's why we are selecting all fields explicitly in userService
  password: 'string';

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10); // here 10 is inserted as salt
  }
}
