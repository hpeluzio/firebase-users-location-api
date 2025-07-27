import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateUserDto();
      dto.name = 'John Doe';
      dto.zipCode = '10001';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new CreateUserDto();
      dto.name = '';
      dto.zipCode = '10001';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with invalid zip code format', async () => {
      const dto = new CreateUserDto();
      dto.name = 'John Doe';
      dto.zipCode = 'invalid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBeDefined();
    });

    it('should pass validation with extended zip code format', async () => {
      const dto = new CreateUserDto();
      dto.name = 'John Doe';
      dto.zipCode = '10001-1234';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with single character name (minimum length)', async () => {
      const dto = new CreateUserDto();
      dto.name = 'A';
      dto.zipCode = '10001';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with too long name', async () => {
      const dto = new CreateUserDto();
      dto.name = 'A'.repeat(101); // 101 characters
      dto.zipCode = '10001';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
      expect(Object.keys(errors[0].constraints || {})).toContain('isLength');
    });
  });
});
