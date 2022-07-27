import { sign } from "jsonwebtoken";

class GenerateTokenProvider {
  async execute(userId: string) {
    const token = sign({}, process.env.SECRET_TOKEN_KEY!, {
      subject: userId,
      expiresIn: "15m",
    });

    return token;
  }
}

export { GenerateTokenProvider };
