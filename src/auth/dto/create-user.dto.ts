import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { KsDepartment } from '../user-ksDepartment.type';

export class AuthCredentialDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/@ks.ac.kr$/, {
    message: '경성대학교 이메일이어야 합니다.',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    {
      message: '숫자와 영문자, 특수문자 조합으로 8~20자리를 사용해야 합니다.',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  enterYear: string;

  @IsNotEmpty()
  @IsString()
  ksDepartment: KsDepartment;
}
