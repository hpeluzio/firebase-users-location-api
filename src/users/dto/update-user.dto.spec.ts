import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  describe('validation', () => {
    it('should pass validation with valid name only', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid zip code only', async () => {
      const dto = new UpdateUserDto();
      dto.zipCode = '90210';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with both name and zip code', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';
      dto.zipCode = '90210';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new UpdateUserDto();
      dto.name = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with invalid zip code format', async () => {
      const dto = new UpdateUserDto();
      dto.zipCode = 'invalid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBeDefined();
    });

    it('should pass validation with extended zip code format', async () => {
      const dto = new UpdateUserDto();
      dto.zipCode = '90210-1234';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with single character name (minimum length)', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'A';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with too long name', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'A'.repeat(101); // 101 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
      expect(Object.keys(errors[0].constraints || {})).toContain('isLength');
    });

    it('should pass validation with empty object (partial update)', async () => {
      const dto = new UpdateUserDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
