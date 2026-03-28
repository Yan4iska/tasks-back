import { Test, TestingModule } from '@nestjs/testing'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

import { TaskDto } from './dto/task.dto'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

describe('TaskController', () => {
	let controller: TaskController
	let taskService: TaskService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TaskController],
			providers: [
				{
					provide: TaskService,
					useValue: {
						getAll: jest.fn(),
						create: jest.fn(),
						update: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<TaskController>(TaskController)
		taskService = module.get<TaskService>(TaskService)
	})

	describe('createTask', () => {
		it('should call service.create with dto and userId', async () => {
			const dto: TaskDto = { name: 'Test Task' }
			await controller.createTask('userId', dto)
			expect(taskService.create).toHaveBeenCalledWith(dto, 'userId')
		})
	})

	describe('delete', () => {
		it('should call service.delete with taskId', async () => {
			await controller.delete('taskId')
			expect(taskService.delete).toHaveBeenCalledWith('taskId')
		})
	})
})
