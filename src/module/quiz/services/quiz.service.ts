import { Injectable, Options } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { events } from 'src/common/constants/event.constant';
import { Repository } from 'typeorm';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { Question } from '../entities/question.entity';
import { Quiz } from '../entities/quiz.entity';
import { ResponseAddEvent } from '../events/response-add.events';

@Injectable()
export class QuizService {
  constructor(@InjectRepository(Quiz) private QuizRepo: Repository<Quiz>) {}

  create(createQuizDto: CreateQuizDto, userId: number) {
    return this.QuizRepo.save({
      userId: String(userId),
      ...createQuizDto,
    });
  }

  async getAllQuiz(): Promise<Quiz[]> {
    const quiz = await this.QuizRepo.find({
      relations: ['user'],
    });
    return quiz;
    // return await this.QuizRepo.createQueryBuilder('q')
    //   // .leftJoinAndSelect(Question, 'qt', 'q.id = qt.quizId')
    //   .leftJoinAndSelect('q.questions', 'qt')
    //   // .leftJoinAndSelect('qt.options', 'o')
    //   // .take(1)
    //   // .getManyAndCount();
    //   .getMany();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Quiz>> {
    const qb = this.QuizRepo.createQueryBuilder('q');
    qb.orderBy('q.id', 'DESC');
    return paginate<Quiz>(qb, options);
  }

  async getQuizById(id: number) {
    const quiz = await this.QuizRepo.findOne({
      where: { id },
      // relations: [''],
    });
    return quiz;
  }

  async getQuizByUserId(userId: string) {
    return await this.QuizRepo.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: number, updateQuizDto: any) {
    const quiz = await this.QuizRepo.findOne({
      where: { id },
    });
    console.log(quiz);
    if (!quiz) {
      return 'Quiz not found';
    }
    try {
      const quest = await this.QuizRepo.update(id, {
        questions: updateQuizDto.questions,
      });

      return quest;
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: number) {
    const quiz = await this.QuizRepo.findOne({
      where: { id },
    });
    const a = await quiz.remove();

    return a;
  }

  @OnEvent(events.RESPONSE_SUBMITTED)
  checkQuizCompleted(payload: ResponseAddEvent) {
    console.log('checkQuizCompleted', payload);
  }
}
