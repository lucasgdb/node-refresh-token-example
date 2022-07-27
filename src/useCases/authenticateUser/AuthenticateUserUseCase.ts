import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { client } from "../../prisma/client";
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest) {
    const user = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error("username or password incorrect.");
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new Error("username or password incorrect.");
    }

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(user.id);

    await client.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
    const refreshToken = await generateRefreshTokenProvider.execute(user.id);

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase };
