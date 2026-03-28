import { Test, TestingModule } from '@nestjs/testing'
import { TimeBlockController } from './time-block.controller'
import { TimeBlockService } from './time-block.service'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

describe('TimeBlockController', () => {
	let controller: TimeBlockController
	let service: jest.Mocked<TimeBlockService>

	const timeBlockEntity = {
		id: 'tb123',
		name: 'Study',
		duration: 45,
		color: '#FF0000',
		order: 1,
		userId: 'user123',
		createdAt: new Date(),
		updatedAt: new Date()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TimeBlockController],
			providers: [
				{
					provide: TimeBlockService,
					useValue: {
						getAll: jest.fn(),
						create: jest.fn(),
						updateOrder: jest.fn(),
						update: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		}).compile()

		controller = module.get<TimeBlockController>(TimeBlockController)
		service = module.get(TimeBlockService)
	})

	describe('getAll', () => {
		it('should return all time blocks for the user', async () => {
			const userId = 'user123'
			service.getAll.mockResolvedValue([timeBlockEntity])

			const result = await controller.getAll(userId)
			expect(service.getAll).toHaveBeenCalledWith(userId)
			expect(result).toEqual([timeBlockEntity])
		})
	})

	describe('create', () => {
		it('should create a new time block', async () => {
			const userId = 'user123'
			const dto: TimeBlockDto = {
				name: 'Study',
				duration: 45,
				color: '#FF0000',
				order: 1
			}

			service.create.mockResolvedValue(timeBlockEntity)

			const result = await controller.create(userId, dto)
			expect(service.create).toHaveBeenCalledWith(dto, userId)
			expect(result).toEqual(timeBlockEntity)
		})
	})

	describe('updateTimeBlock (order)', () => {
		it('should update order of time blocks', async () => {
			const dto: UpdateOrderDto = { ids: ['id1', 'id2', 'id3'] }
			const updatedBlocks = [timeBlockEntity]

			service.updateOrder.mockResolvedValue(updatedBlocks)

			const result = await controller.updateTimeBlock(dto)
			expect(service.updateOrder).toHaveBeenCalledWith(dto.ids)
			expect(result).toEqual(updatedBlocks)
		})
	})

	describe('update', () => {
		it('should update a time block', async () => {
			const id = 'tb123'
			const userId = 'user123'
			const dto: TimeBlockDto = {
				name: 'Updated Block',
				duration: 30,
				color: '#00FF00',
				order: 2
			}

			const updatedBlock = { ...timeBlockEntity, ...dto, updatedAt: new Date() }

			service.update.mockResolvedValue(updatedBlock)

			const result = await controller.update(userId, dto, id)
			expect(service.update).toHaveBeenCalledWith(id, userId, dto)
			expect(result).toEqual(updatedBlock)
		})
	})

	describe('delete', () => {
		it('should delete a time block', async () => {
			const id = 'tb123'
			const userId = 'user123'

			service.delete.mockResolvedValue(timeBlockEntity)

			const result = await controller.delete(id, userId)
			expect(service.delete).toHaveBeenCalledWith(id, userId)
			expect(result).toEqual(timeBlockEntity)
		})
	})
})
