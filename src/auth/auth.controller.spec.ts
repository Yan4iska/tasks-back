import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { UnauthorizedException } from '@nestjs/common'

describe('AuthController', () => {
	let controller: AuthController
	let authService: jest.Mocked<AuthService>

	const mockResponse: any = { cookie: jest.fn(), clearCookie: jest.fn() }

	const loginResponse = {
		accessToken: 'access-token',
		user: { id: '1', email: 'test@mail.com' },
		refreshToken: 'refresh-token'
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						login: jest.fn().mockResolvedValue(loginResponse),
						getNewTokens: jest.fn().mockResolvedValue(loginResponse),
						addRefreshTokenToResponse: jest.fn(),
						removeRefreshTokenToResponse: jest.fn(),
						REFRESH_TOKEN_NAME: 'refreshToken'
					}
				}
			]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		authService = module.get(AuthService)
	})

	describe('POST /auth/login', () => {
		it('should login and return accessToken and user without refreshToken', async () => {
			const dto: AuthDto = { email: 'test@mail.com', password: '123456' }
			const result = await controller.login(dto, mockResponse)

			expect(authService.login).toHaveBeenCalledWith(dto)
			expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				'refresh-token'
			)
			expect(result).toEqual({
				accessToken: 'access-token',
				user: { id: '1', email: 'test@mail.com' }
			})
		})
	})

	describe('POST /auth/register', () => {
		it('should register and return accessToken and user without refreshToken', async () => {
			const dto: AuthDto = { email: 'test@mail.com', password: '123456' }
			const result = await controller.register(dto, mockResponse)

			expect(authService.login).toHaveBeenCalledWith(dto)
			expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				'refresh-token'
			)
			expect(result).toEqual({
				accessToken: 'access-token',
				user: { id: '1', email: 'test@mail.com' }
			})
		})
	})

	describe('POST /auth/login/access-token', () => {
		it('should return new accessToken and user', async () => {
			const mockRequest: any = { cookies: { refreshToken: 'refresh-token' } }

			const result = await controller.getNewTokens(mockRequest, mockResponse)

			expect(authService.getNewTokens).toHaveBeenCalledWith('refresh-token')
			expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				'refresh-token'
			)
			expect(result).toEqual({
				accessToken: 'access-token',
				user: { id: '1', email: 'test@mail.com' }
			})
		})

		it('should throw if refreshToken is missing', async () => {
			const mockRequest: any = { cookies: {} }

			await expect(
				controller.getNewTokens(mockRequest, mockResponse)
			).rejects.toThrow(UnauthorizedException)

			expect(authService.removeRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse
			)
		})
	})

	describe('POST /auth/logout', () => {
		it('should clear refresh token and return true', async () => {
			const result = await controller.logout(mockResponse)

			expect(authService.removeRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse
			)
			expect(result).toBe(true)
		})
	})
})
