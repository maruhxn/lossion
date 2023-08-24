import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

//? 위에서 구글 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }), //? 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  (req, res) => {
    const accessToken = jwt.sign(req.user!, process.env.JWT_SECRET!);
    res.redirect(`/login-success?accessToken=${accessToken}`);
  }
);

router.get(
  "/kakao",
  passport.authenticate("kakao", {
    session: false,
  })
);

//? 위에서 구글 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { session: false, failureRedirect: "/" }), //? 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  (req, res) => {
    const accessToken = jwt.sign(req.user!, process.env.JWT_SECRET!);
    res.redirect(`/login-success?accessToken=${accessToken}`);
  }
);

export default router;
