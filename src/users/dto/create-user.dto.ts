import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Zip code must be in valid US format (e.g., 12345 or 12345-6789)',
  })
  zipCode: string;
}
