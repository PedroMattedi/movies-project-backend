import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'The Matrix', required: false })
  @IsOptional()
  @IsString()
  originalTitle?: string;

  @ApiProperty({ example: '1999-03-31' })
  @IsDateString()
  releaseDate: string;

  @ApiProperty({
    example: 'A computer hacker learns about the true nature of reality...',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 63000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiProperty({ example: 136, description: 'Duration in minutes' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'Action' })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
