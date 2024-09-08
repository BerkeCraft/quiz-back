import { Question } from 'src/module/quiz/entities/question.entity';
import { User } from 'src/module/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('quizzes')
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'boolean',
    default: 1,
  })
  isActive: boolean;

  // @OneToMany(() => Question, (question) => question.quiz)
  // questions: Question[];

  @ManyToOne(() => User, (user) => user.quizs)
  @JoinColumn()
  user: User;

  @RelationId((quiz: Quiz) => quiz.user)
  @Column({ nullable: true })
  userId: string;

  @Column({
    type: 'jsonb',
    default: [],
  })
  questions: any;
}
