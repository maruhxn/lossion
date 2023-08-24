import * as usersRepository from "@/db/repositories/users.repository";
import { CreateUserDto } from "@/libs/validators/users.validator";

import { Strategy as KakaoStrategy } from "passport-kakao";

const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.KAKAO_CLIENT_ID!, // 카카오 로그인에서 발급받은 REST API 키
    callbackURL: "/api/v1/auth/kakao/callback", // 카카오 로그인 Redirect URI 경로
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("kakao profile", profile);
    try {
      const exUser = await usersRepository.getUserOnLogin(profile.id, "kakao");
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
          email: profile._json && profile._json.kakao_account.email,
          username: profile.displayName,
          snsId: profile.id,
          provider: "kakao",
        };

        const newUser = await usersRepository.createUser(createUserDto);
        done(null, {
          userId: newUser.id,
          email: newUser.email,
          username: newUser.username,
        }); // 회원가입하고 로그인 인증 완료
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
);

export default kakaoStrategy;
