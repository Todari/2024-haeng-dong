import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BillDetailInput {
  @IsNumber()
  memberId!: number;

  @IsNumber()
  price!: number;

  @IsBoolean()
  isFixed!: boolean;
}

export class CreateBillDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title!: string;

  @IsNumber()
  @Min(1)
  @Max(10_000_000)
  price!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillDetailInput)
  billDetails!: BillDetailInput[];
}

export class UpdateBillDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title!: string;

  @IsNumber()
  @Min(1)
  @Max(10_000_000)
  price!: number;
}

export class UpdateBillDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillDetailInput)
  billDetails!: BillDetailInput[];
}
