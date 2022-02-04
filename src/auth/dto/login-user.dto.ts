import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginInputDto {
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
      message: '비밀번호가 틀렸습니다.',
    },
  )
  password: string;
}
