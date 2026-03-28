import { Test } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { Reflector } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common/pipes'

describe('UserController', () => {
	let userController: UserController
	let userService: jest.Mocked<UserService>
	let reflector: Reflector

	const mockProfileResponse = {
		user: { id: '1', email: 'test@test.com', tasks: [] },
		statistics: [
			{ label: 'Total', val: 0 },
			{ label: 'Completed tasks', val: 0 },
			{ label: 'Today tasks', val: 0 },
			{ label: 'Week tasks', val: 0 }
		]
	}

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: {
						getProfile: jest.fn().mockResolvedValue(mockProfileResponse),
						update: jest.fn().mockResolvedValue({ email: 'updated@test.com' })
					}
				},
				Reflector
			]
		}).compile()

		userController = moduleRef.get<UserController>(UserController)
		userService = moduleRef.get(UserService)
		reflector = moduleRef.get(Reflector)
	})

	describe('GET /user/profile', () => {
		it('should return user profile with statistics', async () => {
			const result = await userController.profile('1')
			expect(result).toEqual(mockProfileResponse)
			expect(userService.getProfile).toHaveBeenCalledWith('1')
		})
	})

	describe('PUT /user/profile', () => {
		const updateDto: UserDto = {
			email: 'updated@test.com',
			password: 'newpassword123',
			workInterval: 45,
			breakInterval: 15,
			intervalsCount: 5
		}

		it('should update user profile', async () => {
			const result = await userController.updateProfile('1', updateDto)
			expect(result).toEqual({ email: 'updated@test.com' })
			expect(userService.update).toHaveBeenCalledWith('1', updateDto)
		})

		it('should have ValidationPipe', () => {
			const pipes = reflector.get<any[]>(
				'__pipes__',
				userController.updateProfile
			)
			expect(pipes.some(pipe => pipe instanceof ValidationPipe)).toBe(true)
		})
	})
})
