import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from '../auth';

export class CreateUserDto extends OmitType(RegisterDto, ['avatar']) {
  avatar?: string;
}
