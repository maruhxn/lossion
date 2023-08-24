import passport from "passport";
import googleStrategy from "./google-strategy";
import kakaoStrategy from "./kakao-strategy";

export interface UserInfo {
  userId: string;
  email: string;
  username: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends UserInfo {}
  }
}

passport.use("google", googleStrategy);
passport.use("kakao", kakaoStrategy);

export default passport;
