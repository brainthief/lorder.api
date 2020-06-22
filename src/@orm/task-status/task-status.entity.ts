import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum STATUS_NAME {
  CREATING = 'creating',
  ESTIMATION_BEFORE_ASSIGNING = 'estimation_before_assigning',
  ASSIGNING_RESPONSIBLE = 'assigning_responsible',
  ESTIMATION_BEFORE_PERFORMER = 'estimating_before_PERFORMER',
  ASSIGNING_PERFORMER = 'assigning_performer',
  ESTIMATION_BEFORE_TO_DO = 'estimation_before_to_do',
  READY_TO_DO = 'ready_to_do',
  IN_PROGRESS = 'in_progress',
  AUTO_TESTING = 'auto_testing',
  PROF_REVIEW = 'prof_review',
  ESTIMATION_BEFORE_TEST = 'estimation_before_test',
  READY_TO_TEST = 'ready_to_test',
  TESTING = 'testing',
  ARCHITECT_REVIEW = 'architect_review',
  READY_TO_DEPLOY = 'ready_to_deploy',
  DEPLOYING = 'deploying',
  DEPLOYED_PROF_ESTIMATION = 'deployed_prof_estimation',
  DEPLOYED_ARCHITECT_ESTIMATION = 'deployed_architect_estimation',
  DEPLOYED_COMMUNITY_ESTIMATION = 'deployed_community_estimation',
  DEPLOYED_ESTIMATION = 'deployed_estimating',
  DONE = 'done',
}

@Entity()
export class TaskStatus {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @PrimaryColumn()
  name!: STATUS_NAME;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusFrom!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusTo!: number;
}
