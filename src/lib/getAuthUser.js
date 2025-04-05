import { cookies } from "next/headers";
import { decrypt } from "./session";

export default async function getAuthUser() {
  // Get Cookies
  const coookieStore = await cookies();
  const session = coookieStore.get("session")?.value;
  // console.log("session=", session);
  if (session) {
    const user = await decrypt(session);
    return user;
  }
  // 세션이 없으면 null을 반환합니다.
  return null;
}