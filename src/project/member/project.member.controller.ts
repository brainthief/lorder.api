import { Body, Controller, Delete, Headers, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../../@common/decorators';
import { IdDto } from '../../@common/dto';
import { RolesGuard } from '../../@common/guards';
import { Project } from '../../@orm/project';
import { EmailDto, User } from '../../@orm/user';
import { ACCESS_LEVEL, UserProject } from '../../@orm/user-project';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { ProjectService } from '../project.service';
import { ProjectMemberService } from './project.member.service';

@ApiBearerAuth()
@ApiUseTags('projects -> members (role: user)')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService
  ) {}

  @ApiResponse({
    description: 'The Invite has been successfully sent.',
    status: 201,
    type: UserProject,
  })
  @Post()
  @Roles('admin')
  @AccessLevel(ACCESS_LEVEL.YELLOW)
  public async invite(
    @Body() data: EmailDto,
    @Headers('origin') origin: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<UserProject> {
    return this.projectMemberService.invite(project, data, origin, user);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Delete()
  @Roles('admin')
  @AccessLevel(ACCESS_LEVEL.GREEN)
  public async delete(
    @Body() data: IdDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<boolean> {
    return this.projectMemberService.removeMemberFromProject(data, project);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Patch('accept')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.WHITE)
  public async accept(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<UserProject> {
    return this.projectMemberService.acceptInvitation(user, project);
  }
}
