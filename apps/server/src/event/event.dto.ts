import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateGuestEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  eventName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  eventName!: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  eventName?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}
