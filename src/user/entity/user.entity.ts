import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/entity/article.entity';

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

  @OneToMany( () => ArticleEntity , (article) => article.author) // @OneToMany() takes two parameter , from first callback function we are returning our ArticleEntity , 
  articles: ArticleEntity[];                                    // & second claaback function takes (article) as an argument and returning author of the article. 

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];
}
