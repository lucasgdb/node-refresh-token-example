import dayjs from "dayjs";

import { client } from "../prisma/client";

class GenerateRefreshTokenProvider {
  async execute(userId: string) {
    const expiresIn = dayjs().add(15, "days").unix();

    const refreshToken = await client.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });

    return refreshToken;
  }
}

export { GenerateRefreshTokenProvider };
