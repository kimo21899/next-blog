import "server-only"; // 이 파일은 서버 전용입니다.

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

// 환경설정 파일에서 SESSION_SECRET을 가져옵니다.
const secretKey = process.env.SESSION_SECRET;
const encodeKey = new TextEncoder().encode(secretKey);

// 세션을 암호화하는 함수입니다.
// payload는 세션에 저장할 데이터입니다.
// 이 함수는 JWT를 생성하여 세션을 암호화합니다.
// JWT는 JSON Web Token의 약자로, JSON 객체를 사용하여 정보를 안전하게 전송하는 방법입니다.
export async function encrypt(payload){
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(encodeKey);
};

// 세션을 복호화하는 함수입니다.
// session은 암호화된 세션 데이터입니다.
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodeKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to vrefy session", error);
  }
}

// 세션을 생성하는 함수입니다.
// userId는 세션에 저장할 사용자 ID입니다.
export async function createSession(userId) {
  const expireAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6시간 후 만료
  const session = await encrypt({ userId, expireAt });
  const cookieStore = await cookies();
  
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expireAt,
    sameSite: "lax",
    path: "/",
  }); 
}
