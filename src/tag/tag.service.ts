import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}
  async display(): Promise<{ tags: string[] }> {
    const tags = await this.tagRepo.find();
    if (tags.length) {
      return {
        tags: tags.map((tag) => tag.name),
      };
    }
    throw new NotFoundException('No table exist in database')
  }
}
