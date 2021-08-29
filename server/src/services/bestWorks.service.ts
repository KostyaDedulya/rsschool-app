import { getRepository } from 'typeorm';
import { BestWork, Course, Task, User } from '../models';

interface IPostBestWork {
  id?: number;
  users: number[];
  task: Task;
  projectUrl: string;
  imageUrl: string;
  tags: string[];
  course: Course;
}

async function changeToResponse(values: BestWork[]) {
  const result = values.map(e => {
    const { users: usersFromDB, course, task: taskFromDB, createdDate, updatedDate, ...data } = e;
    const users = usersFromDB.map(u => {
      const { id, githubId } = u;
      return { id, githubId };
    });
    const task = taskFromDB.id;
    return { users, task, ...data };
  });
  return result;
}

export async function getAllBestWorks() {
  const bestWorkRepository = getRepository(BestWork);
  const result = await bestWorkRepository.find({
    relations: ['users', 'task', 'course'],
  });
  return result;
}

export async function getBestWorksByTaskId(id: number) {
  const bestWorkRepository = getRepository(BestWork);
  const result = await bestWorkRepository.find({
    relations: ['users', 'task', 'course'],
    where: { task: { id } },
  });
  return changeToResponse(result);
}

export async function postBestWork(data: IPostBestWork) {
  const { users, ...toSave } = data;
  const userRepository = getRepository(User);
  const usersFromDB = await userRepository
    .createQueryBuilder('user')
    .where('user.id IN (:...id)', { id: users })
    .getMany();
  const bestWorkRepository = getRepository(BestWork);
  const result = await bestWorkRepository.save({ ...toSave, users: usersFromDB });
  return changeToResponse([result]);
}

export async function changeBestWork(data: BestWork) {
  try {
    const bestWorkRepository = getRepository(BestWork);
    const bestWorkFormDB = await bestWorkRepository.findOne({ where: { id: data.id } });
    if (!bestWorkFormDB) throw new Error('Best work not found');
    let { users } = data;
    if (users) {
      const userRepository = getRepository(User);
      users = await userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...id)', { id: data.users })
        .getMany();
    }
    const updatedBestWork = { ...bestWorkFormDB, ...data, users };
    const result = await bestWorkRepository.save(updatedBestWork);
    console.log(result);
    return changeToResponse([result]);
  } catch (e) {
    return {
      message: e.message,
    };
  }
}

export async function getCourseListWithBestWorks() {
  const bestWorkRepository = getRepository(BestWork);
  const courses = await bestWorkRepository
    .createQueryBuilder('bw')
    .select('bw."courseId"', 'courseId')
    .addSelect('c.name', 'courseName')
    .innerJoin(Course, 'c', 'bw."courseId" = c.id')
    .groupBy('bw."courseId"')
    .addGroupBy('c.name')
    .getRawMany();
  return courses;
}

export async function getCourseTaskListWithBestWorks(id: number) {
  const bestWorkRepository = getRepository(BestWork);
  const tasks = await bestWorkRepository
    .createQueryBuilder('bw')
    .select('bw."taskId"', 'taskId')
    .addSelect('t.name', 'taskName')
    .innerJoin(Task, 't', 'bw."taskId" = t.id')
    .where('bw."courseId" = :courseId', { courseId: id })
    .groupBy('bw."taskId"')
    .addGroupBy('t.name')
    .getRawMany();
  return tasks;
}
