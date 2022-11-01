import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}
  /**
   * It creates a new feedback object and saves it to the database
   * @param {CreateFeedbackDto} createFeedbackDto - CreateFeedbackDto
   * @returns The feedback object
   */
  async create(createFeedbackDto: CreateFeedbackDto) {
    if (!createFeedbackDto.type) {
      throw new Error('type is required');
    }
    if (!createFeedbackDto.comment) {
      throw new Error('type is required');
    }
    if (
      createFeedbackDto.screenshot &&
      !createFeedbackDto.screenshot.startsWith('data:image/png:base64')
    ) {
      throw new Error('Format invalid screenshot');
    }
    const email = await this.userService.findOneByEmail(
      createFeedbackDto.email,
    );
    this.feedbackRepository.create(createFeedbackDto);
    await this.mailerService.sendMail({
      subject: 'New Feedback',
      to: `${email}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px color: #111">
          <p>Tipo de feedback: ${createFeedbackDto.type}</p>
          <p>Comentário: ${createFeedbackDto.comment}</P>
          <img src="${createFeedbackDto.screenshot}" />
        </div>
      `,
    });
    const feedback = await this.feedbackRepository.save(createFeedbackDto);
    return feedback;
  }

  /**
   * It finds all feedbacks in the database and returns them
   * @returns An array of feedbacks
   */
  async findAll() {
    const feedback = await this.feedbackRepository.find();
    if (!feedback) {
      throw new HttpException('feedbacks not found', HttpStatus.NOT_FOUND);
    }
    return feedback;
  }

  /**
   * It finds a feedback by its id and if it doesn't exist, it throws an error
   * @param {string} id - string - the id of the feedback we want to find
   * @returns The feedback object
   */
  async findOne(id: string) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new HttpException('feedback not found', HttpStatus.NOT_FOUND);
    }
    return feedback;
  }

  /**
   * It updates a feedback by id
   * @param {string} id - The id of the feedback to be updated
   * @param {UpdateFeedbackDto} updateFeedbackDto - UpdateFeedbackDto
   * @returns The feedback that was updated.
   */
  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const feedbackExists = await this.feedbackRepository.findOneBy({ id });
    if (!feedbackExists) {
      throw new HttpException('feedback not found', HttpStatus.NOT_FOUND);
    }
    const feedback = await this.feedbackRepository.update(
      { id },
      {
        type: updateFeedbackDto.type,
        comment: updateFeedbackDto.comment,
        screenshot: updateFeedbackDto.screenshot,
      },
    );
    return feedback;
  }

  /**
   * It deletes a feedback from the database
   * @param {string} id - string - The id of the feedback to be deleted.
   * @returns The feedback that was deleted.
   */
  async remove(id: string) {
    const feedback = await this.feedbackRepository.delete({ id });
    if (!feedback) {
      throw new HttpException('feedback not found', HttpStatus.NOT_FOUND);
    }
    return feedback;
  }
}
