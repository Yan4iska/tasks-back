import { Test, TestingModule } from '@nestjs/testing'
import { TimeBlockService } from './time-block.service'
import { PrismaService } from '../prisma.service'
import { prismaMock } from '../../test/prisma.service.mock'

describe('TimeBlockService', () => {
	let service: TimeBlockService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TimeBlockService,
				{ provide: PrismaService, useValue: prismaMock }
			]
		}).compile()

		service = module.get<TimeBlockService>(TimeBlockService)
		jest.clearAllMocks()
	})

	it('should get all blocks for user', async () => {
		const mockBlocks = [{ id: '1' }, { id: '2' }]
		prismaMock.timeBlock.findMany.mockResolvedValue(mockBlocks)

		const result = await service.getAll('userId')
		expect(result).toBe(mockBlocks)
		expect(prismaMock.timeBlock.findMany).toHaveBeenCalledWith({
			where: { userId: 'userId' },
			orderBy: { order: 'asc' }
		})
	})

	it('should create new block', async () => {
		const dto = { name: 'Work', color: 'red', duration: 60, order: 1 }
		prismaMock.timeBlock.create.mockResolvedValue({ id: 'newBlock', ...dto })

		const result = await service.create(dto, 'userId')
		expect(result).toEqual({ id: 'newBlock', ...dto })
		expect(prismaMock.timeBlock.create).toHaveBeenCalledWith({
			data: { ...dto, user: { connect: { id: 'userId' } } }
		})
	})

	it('should update block', async () => {
		const dto = { name: 'Updated Title' }
		prismaMock.timeBlock.update.mockResolvedValue({ id: 'blockId', ...dto })

		const result = await service.update('blockId', 'userId', dto)
		expect(result).toEqual({ id: 'blockId', ...dto })
		expect(prismaMock.timeBlock.update).toHaveBeenCalledWith({
			where: { id: 'blockId', userId: 'userId' },
			data: dto
		})
	})

	it('should delete block', async () => {
		prismaMock.timeBlock.delete.mockResolvedValue({ id: 'deletedBlock' })

		const result = await service.delete('deletedBlock', 'userId')
		expect(result).toEqual({ id: 'deletedBlock' })
		expect(prismaMock.timeBlock.delete).toHaveBeenCalledWith({
			where: { id: 'deletedBlock', userId: 'userId' }
		})
	})
})
