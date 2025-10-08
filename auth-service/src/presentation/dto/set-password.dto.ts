import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordDto {
  @ApiProperty({ description: 'New password for the user', example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
