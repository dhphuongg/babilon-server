import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class IGetListParams {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit: number = 10;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // @Type(() => Number)
  // readonly sortBy?: string;

  // @ApiProperty({ required: false, enum: Order, default: Order.DESC })
  // @IsOptional()
  // @IsEnum(Order)
  // @Type(() => Number)
  // readonly order: Order = Order.DESC;
}
