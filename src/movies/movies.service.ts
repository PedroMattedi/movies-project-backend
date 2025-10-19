import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto, userId: string) {
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        releaseDate: new Date(createMovieDto.releaseDate),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filterDto: FilterMovieDto) {
    const { search, genre, minDuration, maxDuration, releaseDateFrom, releaseDateTo, page = 1, limit = 10 } = filterDto;

    const where: any = {};

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (genre) {
      where.genre = {
        equals: genre,
        mode: 'insensitive',
      };
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) {
        where.duration.gte = minDuration;
      }
      if (maxDuration !== undefined) {
        where.duration.lte = maxDuration;
      }
    }

    if (releaseDateFrom || releaseDateTo) {
      where.releaseDate = {};
      if (releaseDateFrom) {
        where.releaseDate.gte = new Date(releaseDateFrom);
      }
      if (releaseDateTo) {
        where.releaseDate.lte = new Date(releaseDateTo);
      }
    }

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data: movies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string) {
    const movie = await this.findOne(id);

    if (movie.userId !== userId) {
      throw new ForbiddenException('You can only update your own movies');
    }

    const updateData: any = { ...updateMovieDto };
    if (updateMovieDto.releaseDate) {
      updateData.releaseDate = new Date(updateMovieDto.releaseDate);
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const movie = await this.findOne(id);

    if (movie.userId !== userId) {
      throw new ForbiddenException('You can only delete your own movies');
    }

    await this.prisma.movie.delete({
      where: { id },
    });

    return { message: 'Movie deleted successfully' };
  }

  async findUpcomingReleases() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        user: true,
      },
    });
  }
}
