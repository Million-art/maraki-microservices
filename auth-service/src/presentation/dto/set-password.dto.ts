import { IsString, IsNotEmpty } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
