import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendInviteDto {
  @ApiProperty({ description: 'Email address of the user to resend invite', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
