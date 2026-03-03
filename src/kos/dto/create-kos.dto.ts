import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateKosDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(['MALE', 'FEMALE', 'ALL'])
  gender: 'MALE' | 'FEMALE' | 'ALL';
}
