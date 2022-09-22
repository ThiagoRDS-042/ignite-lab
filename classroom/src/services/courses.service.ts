import { ConflictException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCourseParams {
  title: string;
}

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  listAllCourses() {
    return this.prismaService.course.findMany();
  }

  getCourseById(id: string) {
    return this.prismaService.course.findUnique({ where: { id } });
  }

  async createCourse({ title }: CreateCourseParams) {
    const slug = slugify(title, { lower: true });

    const courseAlreadyExists = await this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseAlreadyExists) {
      throw new ConflictException('Course already exists');
    }

    return this.prismaService.course.create({
      data: {
        slug,
        title,
      },
    });
  }
}
