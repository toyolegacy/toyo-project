import { IsString, IsNumber } from 'class-validator';

export class SaveNftDto {
  @IsNumber()
  nftId!: number;

  @IsNumber()
  templateId!: number;

  @IsString()
  playerId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  value!: number;
}
