import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { Quiz } from '../entities/quiz.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ApiPaginatedResponse } from 'src/common/decorator/api-pagination.response';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';

import { AdminRoleGuard } from 'src/module/auth/admin-role.guard';
import { RolesGuard } from 'src/module/auth/roles.guard';
import { Roles } from 'src/module/auth/roles.decorator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@ApiTags('Quiz')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post('/create-quiz')
  async create(@Body() createQuizDto: CreateQuizDto, @User() user) {
    console.log(user.id);
    return await this.quizService.create(createQuizDto, user.id);
  }

  @ApiPaginatedResponse({ model: Quiz, description: 'List of quizzes' })
  @Get('/getAll')
  async getAllQuiz(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ): Promise<any> {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return await this.quizService.getAllQuiz();
  }

  @Get('/get-my-quiz')
  async getMyQuiz(@User() user) {
    return await this.quizService.getQuizByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.getQuizById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: any) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
