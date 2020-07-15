import { User } from "src/modules/user/user.entity";

export class UserResponseDto {
  id: string;
  email: string;

  static fromEntity(user: User) {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;

    return dto;
  }
}