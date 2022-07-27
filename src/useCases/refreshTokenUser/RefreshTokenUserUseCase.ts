import dayjs from "dayjs";
import { client } from "../../prisma/client";
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

class RefreshTokenUserUseCase {
  async execute(refreshToken: string) {
    const validRefreshToken = await client.refreshToken.findFirst({
      where: {
        id: refreshToken,
      },
    });

    if (!validRefreshToken) {
      throw new Error("invalid Refresh Token.");
    }

    const isRefreshTokenExpired = dayjs().isAfter(
      dayjs.unix(validRefreshToken.expiresIn)
    );

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(validRefreshToken.userId);

    if (isRefreshTokenExpired) {
      await client.refreshToken.deleteMany({
        where: {
          userId: validRefreshToken.userId,
        },
      });

      const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
      const newRefreshToken = await generateRefreshTokenProvider.execute(
        validRefreshToken.userId
      );

      return { token, refreshToken: newRefreshToken };
    }

    return { token };
  }
}

export { RefreshTokenUserUseCase };
