import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { PrismaService } from '../prisma.service'
import { UserDto } from './dto/user.dto'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'

// Мокаем весь модуль argon2
jest.mock('argon2', () => ({
	hash: jest.fn().mockImplementation(pass => Promise.resolve(`hashed_${pass}`))
}))

describe('UserService', () => {
	let service: UserService
	let prisma: PrismaService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: PrismaService,
					useValue: {
						user: {
							findUnique: jest.fn(),
							create: jest.fn(),
							update: jest.fn()
						},
						task: { count: jest.fn().mockResolvedValue(1) }
					}
				}
			]
		}).compile()

		service = module.get<UserService>(UserService)
		prisma = module.get<PrismaService>(PrismaService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getProfile', () => {
		it('should return user profile with statistics', async () => {
			const mockUser = { id: '1', email: 'test@mail.com', tasks: [{}, {}] }

			jest.spyOn(service, 'getById').mockResolvedValue(mockUser as any)

			const result = await service.getProfile('1')

			// Обновляем ожидаемый результат, включая tasks
			expect(result.user).toEqual({
				id: '1',
				email: 'test@mail.com',
				tasks: [{}, {}] // Теперь учитываем tasks
			})
			expect(result.statistics).toHaveLength(4)
			expect(prisma.task.count).toHaveBeenCalledTimes(3)
		})
	})

	describe('create', () => {
		it('should create user with hashed password', async () => {
			const dto: AuthDto = { email: 'test@mail.com', password: 'password' }

			jest.spyOn(prisma.user, 'create').mockResolvedValue({} as any)

			await service.create(dto)

			// Проверяем аргументы вызова с хешированным паролем
			expect(prisma.user.create).toHaveBeenCalledWith({
				data: { email: dto.email, name: '', password: `hashed_${dto.password}` }
			})

			// Проверяем вызов функции hash
			expect(hash).toHaveBeenCalledWith(dto.password)
		})
	})

	describe('update', () => {
		it('should update user with hashed password if provided', async () => {
			const dto: UserDto = { email: 'new@mail.com', password: 'newpass' }
			jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any)

			await service.update('1', dto)

			expect(prisma.user.update).toHaveBeenCalledWith({
				where: { id: '1' },
				data: { email: dto.email, password: `hashed_${dto.password}` },
				select: { name: true, email: true }
			})
		})

		it('should update user without password if not provided', async () => {
			const dto: UserDto = { email: 'only@mail.com' } // без пароля
			jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any)

			await service.update('1', dto)

			expect(prisma.user.update).toHaveBeenCalledWith({
				where: { id: '1' },
				data: dto,
				select: { name: true, email: true }
			})
		})
	})

	describe('getById', () => {
		it('should return user by id', async () => {
			const user = { id: '1', email: 'test@mail.com' }
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user as any)

			const result = await service.getById('1')
			expect(result).toEqual(user)
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { id: '1' },
				include: { tasks: true }
			})
		})
	})

	describe('getByEmail', () => {
		it('should return user by email', async () => {
			const user = { id: '1', email: 'test@mail.com' }
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user as any)

			const result = await service.getByEmail('test@mail.com')
			expect(result).toEqual(user)
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: 'test@mail.com' }
			})
		})
	})
})
