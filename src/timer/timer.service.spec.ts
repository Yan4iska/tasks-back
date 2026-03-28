import { Test, TestingModule } from '@nestjs/testing'
import { TimerService } from './timer.service'
import { PrismaService } from '../prisma.service'
import { prismaMock } from '../../test/prisma.service.mock'
import { NotFoundException } from '@nestjs/common'

describe('TimerService', () => {
	let service: TimerService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TimerService,
				{ provide: PrismaService, useValue: prismaMock }
			]
		}).compile()

		service = module.get<TimerService>(TimerService)
	})

	it('should get today session', async () => {
		prismaMock.pomodoroSession.findFirst.mockResolvedValue('session')
		const result = await service.getTodaySession('userId')
		expect(result).toBe('session')
	})

	it('should create a new session if none exists', async () => {
		prismaMock.pomodoroSession.findFirst.mockResolvedValue(null)
		prismaMock.user.findUnique.mockResolvedValue({ intervalsCount: 3 })
		prismaMock.pomodoroSession.create.mockResolvedValue('newSession')

		const result = await service.create('userId')
		expect(result).toBe('newSession')
		expect(prismaMock.pomodoroSession.create).toHaveBeenCalled()
	})

	it('should throw if user not found', async () => {
		prismaMock.pomodoroSession.findFirst.mockResolvedValue(null)
		prismaMock.user.findUnique.mockResolvedValue(null)

		await expect(service.create('userId')).rejects.toThrow(NotFoundException)
	})

	it('should update session', async () => {
		prismaMock.pomodoroSession.update.mockResolvedValue('updated')
		const result = await service.update(
			{ isCompleted: true },
			'userId',
			'sessionId'
		)
		expect(result).toBe('updated')
	})

	it('should update round', async () => {
		prismaMock.pomodoroRound.update.mockResolvedValue('roundUpdated')
		const result = await service.updateRound({ totalSeconds: 1500 }, 'roundId')
		expect(result).toBe('roundUpdated')
	})

	it('should delete session', async () => {
		prismaMock.pomodoroSession.delete.mockResolvedValue('deleted')
		const result = await service.deleteSession('sessionId', 'userId')
		expect(result).toBe('deleted')
	})
})
