import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

jest.mock('../user/user.service')
jest.mock('@nestjs/jwt')

describe('AuthService', () => {
	let service: AuthService
	let userService: jest.Mocked<UserService>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let jwtService: jest.Mocked<JwtService>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, JwtService, UserService]
		}).compile()

		service = module.get<AuthService>(AuthService)
		userService = module.get(UserService)
		jwtService = module.get(JwtService)
	})

	describe('register', () => {
		it('should throw if user exists', async () => {
			userService.getByEmail.mockResolvedValueOnce({ id: '123' } as any)
			await expect(
				service.register({ email: 'test', password: '123456' })
			).rejects.toThrow(BadRequestException)
		})
	})

	describe('login', () => {
		it('should throw if user not found', async () => {
			userService.getByEmail.mockResolvedValue(null)
			await expect(
				service.login({ email: 'test', password: '123456' })
			).rejects.toThrow(NotFoundException)
		})
	})
})
