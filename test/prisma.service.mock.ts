export const prismaMock = {
  timeBlock: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  task: {
    count: jest.fn(),
  },
  pomodoroSession: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pomodoroRound: {
    update: jest.fn(),
  },
};
