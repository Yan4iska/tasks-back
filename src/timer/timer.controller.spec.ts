import { Test, TestingModule } from '@nestjs/testing'
import { TimerController } from './timer.controller'
import { TimerService } from './timer.service'
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto'

describe('TimerController', () => {
	let controller: TimerController
	let service: jest.Mocked<TimerService>

	const userId = 'user123'
	const sessionId = 'session123'
	const mockSession = {
		id: sessionId,
		userId: userId,
		isCompleted: false,
		createdAt: new Date(),
		updatedAt: new Date(),
		rounds: []
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TimerController],
			providers: [
				{
					provide: TimerService,
					useValue: {
						getTodaySession: jest.fn(),
						create: jest.fn(),
						updateRound: jest.fn(),
						update: jest.fn(),
						deleteSession: jest.fn()
					}
				}
			]
		}).compile()

		controller = module.get<TimerController>(TimerController)
		service = module.get(TimerService)
	})

	describe('getTodaySession', () => {
		it("should return today's timer session", async () => {
			service.getTodaySession.mockResolvedValue(mockSession)

			const result = await controller.getTodaySession(userId)
			expect(service.getTodaySession).toHaveBeenCalledWith(userId)
			expect(result).toEqual(mockSession)
		})
	})

	describe('create', () => {
		it('should create a new timer session', async () => {
			service.create.mockResolvedValue(mockSession)

			const result = await controller.create(userId)
			expect(service.create).toHaveBeenCalledWith(userId)
			expect(result).toEqual(mockSession)
		})
	})

	describe('updateRound', () => {
		it('should update a round in a session', async () => {
			const dto: TimerRoundDto = { totalSeconds: 1500, isCompleted: true }

			const updatedRound = {
				id: 'round1',
				pomodoroSessionId: sessionId,
				totalSeconds: dto.totalSeconds,
				isCompleted: dto.isCompleted,
				createdAt: new Date(),
				updatedAt: new Date()
			}

			service.updateRound.mockResolvedValue(updatedRound)

			const result = await controller.updateRound(dto, sessionId)
			expect(service.updateRound).toHaveBeenCalledWith(dto, sessionId)
			expect(result).toEqual(updatedRound)
		})
	})

	describe('update', () => {
		it('should update the session status', async () => {
			const dto: TimerSessionDto = { isCompleted: true }

			const updatedSession = {
				...mockSession,
				isCompleted: dto.isCompleted,
				updatedAt: new Date()
			}

			service.update.mockResolvedValue(updatedSession)

			const result = await controller.update(dto, userId, sessionId)
			expect(service.update).toHaveBeenCalledWith(dto, userId, sessionId)
			expect(result).toEqual(updatedSession)
		})
	})

	describe('deleteSession', () => {
		it('should delete a session', async () => {
			service.deleteSession.mockResolvedValue(mockSession)

			const result = await controller.deleteSession(sessionId, userId)
			expect(service.deleteSession).toHaveBeenCalledWith(sessionId, userId)
			expect(result).toEqual(mockSession)
		})
	})
})
