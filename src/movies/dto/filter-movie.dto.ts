import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMovieDto {
  @ApiPropertyOptional({ example: 'Matrix', description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Action', description: 'Filter by genre' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ example: 90, description: 'Minimum duration in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minDuration?: number;

  @ApiPropertyOptional({ example: 180, description: 'Maximum duration in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDuration?: number;

  @ApiPropertyOptional({ example: '2020-01-01', description: 'Start date for release date filter' })
  @IsOptional()
  @IsDateString()
  releaseDateFrom?: string;

  @ApiPropertyOptional({ example: '2023-12-31', description: 'End date for release date filter' })
  @IsOptional()
  @IsDateString()
  releaseDateTo?: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
