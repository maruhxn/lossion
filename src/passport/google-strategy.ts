import * as usersRepository from "@/db/repositories/users.repository";
import { CreateUserDto } from "@/libs/validators/users.validator";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID!, // 구글 로그인에서 발급받은 REST API 키
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: "/api/v1/auth/google/callback", // 구글 로그인 Redirect URI 경로
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await usersRepository.getUserOnLogin(profile.id, "google");
      // 이미 가입된 구글 프로필이면 성공
      if (exUser) {
        done(null, {
          userId: exUser.id,
          email: exUser.email,
          username: exUser.username,
        }); // 로그인 인증 완료
      } else {
        // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
        const createUserDto: CreateUserDto = {
          email: (profile.emails as any[])[0].value,
          username: profile.displayName,
          snsId: profile.id,
          provider: "google",
        };

        const newUser = await usersRepository.createUser(createUserDto);
        done(null, {
          userId: newUser.id,
          email: newUser.email,
          username: newUser.username,
        }); // 회원가입하고 로그인 인증 완료
      }
    } catch (error: any) {
      console.error(error);
      done(error);
    }
  }
);
export default googleStrategy;
