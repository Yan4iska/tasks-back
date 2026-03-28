import { Test, TestingModule } from '@nestjs/testing'
import { TaskService } from './task.service'
import { PrismaService } from '../prisma.service'
import { TaskDto } from './dto/task.dto'

describe('TaskService', () => {
	let service: TaskService
	let prisma: PrismaService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaskService,
				{
					provide: PrismaService,
					useValue: {
						task: {
							findMany: jest.fn(),
							create: jest.fn(),
							update: jest.fn(),
							delete: jest.fn()
						}
					}
				}
			]
		}).compile()

		service = module.get<TaskService>(TaskService)
		prisma = module.get<PrismaService>(PrismaService)
	})

	describe('create', () => {
		it('should create task with user connection', async () => {
			const dto: TaskDto = { name: 'Test Task' }
			jest.spyOn(prisma.task, 'create').mockResolvedValue({} as any)

			await service.create(dto, 'userId')
			expect(prisma.task.create).toHaveBeenCalledWith({
				data: {
					...dto,
					user: { connect: { id: 'userId' } }
				}
			})
		})
	})

	describe('update', () => {
		it('should update task with correct parameters', async () => {
			const dto: TaskDto = { name: 'Updated Task' }
			jest.spyOn(prisma.task, 'update').mockResolvedValue({} as any)

			await service.update(dto, 'taskId', 'userId')
			expect(prisma.task.update).toHaveBeenCalledWith({
				where: { userId: 'userId', id: 'taskId' },
				data: dto
			})
		})
	})
})
