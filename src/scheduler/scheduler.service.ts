import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies/movies.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchedulerService {
  constructor(
    private moviesService: MoviesService,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleMovieReleaseNotifications() {
    console.log('Checking for movie releases today...');

    try {
      const releasingMovies = await this.moviesService.findUpcomingReleases();

      for (const movie of releasingMovies) {
        await this.mailService.sendMovieReleaseEmail(
          movie.user.email,
          movie.user.name,
          movie.title,
          movie.releaseDate,
        );

        console.log(`Release notification sent for movie: ${movie.title} to ${movie.user.email}`);
      }

      if (releasingMovies.length === 0) {
        console.log('No movies releasing today.');
      }
    } catch (error) {
      console.error('Error sending release notifications:', error);
    }
  }
}
