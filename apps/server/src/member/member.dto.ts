import {
  IsString,
  IsBoolean,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @IsArray()
  @IsString({ each: true })
  names!: string[];
}

export class MemberUpdateItem {
  @IsNumber()
  id!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name!: string;

  @IsBoolean()
  isDeposited!: boolean;
}

export class UpdateMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberUpdateItem)
  members!: MemberUpdateItem[];
}
