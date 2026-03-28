import { validateSync } from 'class-validator'
import { PomodoroSettingsDto, UserDto } from './user.dto'

describe('PomodoroSettingsDto', () => {
	it('should validate correct input', () => {
		const dto = new PomodoroSettingsDto()
		dto.workInterval = 25
		dto.breakInterval = 5
		dto.intervalsCount = 4

		const errors = validateSync(dto)
		expect(errors).toHaveLength(0)
	})

	describe('workInterval', () => {
		it('should fail when less than 1', () => {
			const dto = new PomodoroSettingsDto()
			dto.workInterval = 0
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('min')
		})
	})

	describe('breakInterval', () => {
		it('should fail when less than 1', () => {
			const dto = new PomodoroSettingsDto()
			dto.breakInterval = 0
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('min')
		})
	})

	describe('intervalsCount', () => {
		it('should fail when less than 1', () => {
			const dto = new PomodoroSettingsDto()
			dto.intervalsCount = 0
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('min')
		})

		it('should fail when greater than 10', () => {
			const dto = new PomodoroSettingsDto()
			dto.intervalsCount = 11
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('max')
		})
	})
})

describe('UserDto', () => {
	it('should validate correct input', () => {
		const dto = new UserDto()
		dto.email = 'valid@email.com'
		dto.password = 'password123'
		dto.workInterval = 25
		dto.breakInterval = 5
		dto.intervalsCount = 4

		const errors = validateSync(dto)
		expect(errors).toHaveLength(0)
	})

	describe('email', () => {
		it('should fail with invalid email', () => {
			const dto = new UserDto()
			dto.email = 'invalid-email'
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('isEmail')
		})
	})

	describe('password', () => {
		it('should fail when shorter than 6 characters', () => {
			const dto = new UserDto()
			dto.password = 'short'
			const errors = validateSync(dto)
			expect(errors[0].constraints).toHaveProperty('minLength')
		})
	})

	it('should inherit PomodoroSettingsDto validations', () => {
		const dto = new UserDto()
		dto.intervalsCount = 11
		const errors = validateSync(dto)
		expect(errors[0].constraints).toHaveProperty('max')
	})

	it('should allow optional fields', () => {
		const dto = new UserDto()
		const errors = validateSync(dto)
		expect(errors).toHaveLength(0)
	})
})
