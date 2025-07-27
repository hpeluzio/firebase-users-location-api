import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Zip code must be in valid US format (e.g., 12345 or 12345-6789)',
  })
  zipCode?: string;
}
