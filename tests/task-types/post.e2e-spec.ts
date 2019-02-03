import { Task } from '../../src/@orm/task';
import { TaskType } from '../../src/@orm/task-type';
import { TestHelper } from '../@utils/TestHelper';
import { taskTypesFixtures, usersFixture } from './@fixtures/post';

const h = new TestHelper('/task-types').addFixture(usersFixture).addFixture(taskTypesFixtures);

describe(`POST ${h.url}`, async () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .post(h.path())
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    await h
      .requestBy('user@mail.com')
      .post(h.path())
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy('admin@mail.com')
      .post(h.path())
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by super-admin@mail.com with empty data', async () => {
    await h
      .requestBy('super-admin@mail.com')
      .post(h.path())
      .expect(422)
      .expect({
        errors: [
          {
            children: [],
            constraints: {
              isNotEmpty: 'title should not be empty',
              isString: 'title must be a string',
              maxLength: 'title must be shorter than or equal to 40 characters',
              minLength: 'title must be longer than or equal to 3 characters',
            },
            property: 'title',
          },
        ],
        message: 'Validation Error',
        statusCode: 422,
      });
  });

  it('by super-admin@mail.com only with title', async () => {
    const taskType = {
      title: 'Test type',
    };

    const { body } = await h
      .requestBy('super-admin@mail.com')
      .post(h.path())
      .send(taskType)
      .expect(201);

    expect(body).toEqual({
      ...taskType,
      color: '#D5D5D5',
      icon: null,
      id: expect.any(Number),
      isPublic: expect.any(Boolean),
    });

    await h.removeCreated(TaskType, { id: body.id });
  });

  it('by super-admin@mail.com with correct data', async () => {
    const taskType = {
      color: '#F8A377',
      icon: 'bug',
      title: 'Test type',
    };

    const { body } = await h
      .requestBy('super-admin@mail.com')
      .post(h.path())
      .send(taskType)
      .expect(201);

    expect(body).toEqual({
      ...taskType,
      id: expect.any(Number),
      isPublic: expect.any(Boolean),
    });

    await h.removeCreated(TaskType, { id: body.id });
  });
});
