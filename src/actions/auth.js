"use server";

import bcrypt from "bcrypt";
import { getCollection } from "@/lib/db";
import { RegisterFormSchema, LoginFormSchema } from "@/lib/rules";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

// 회원가입 및 로그인 요청을 처리하는 서버 액션입니다.
export async function register(state, formData) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  // 회원가입 요청으로 넘어온 formData를 사용하여 유효성 검사를 수행합니다.
  // 유효성 검사 규칙은 src/lib/rules.js에 정의되어 있습니다.
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // 유효성 검사에 실패한 경우, 에러 메시지를 반환합니다.
  // 에러 메시지는 src/lib/rules.js에 정의된 규칙에 따라 다르게 표시됩니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      name: formData.get("name"),
      email: formData.get("email"),
    };
  }

  // 유효성 검사 통과 후 DB에 회원가입 정보를 저장합니다.
  const {name, email, password} = validatedFields.data;  
  // console.log(name, email, password);

  // next_blog_db DB에서 users collection(테이블)을 가져옵니다.
  // users collection이 존재하지 않는 경우, 에러 메시지를 반환합니다.
  const userCollection = await getCollection("users");
  if( !userCollection) {
    return { errors: { email: "Server error!" } };
  }

  // user email이 이미 존재하는 경우, 에러 메시지를 반환합니다.
  const exitingUser = await userCollection.findOne({ email });
  if (exitingUser) {
    return {
      errors: { email: "Email already exists." },
      name: formData.get("name"),
    };
  }

  // Hash the password before saving it to the database.
  // 비밀번호를 해시하여 DB에 저장합니다.
  const hashedPassword = await bcrypt.hash(password, 10);

  // users collection에 회원가입 정보를 저장합니다.
  const result= await userCollection.insertOne({    
    name,
    email,
    password: hashedPassword,
  });

  // console.log(result.insertedId);

  // Create Session
  await createSession(result.insertedId.toString());  
  
  // Rediect to login page after successful registration.
  redirect("/dashboard");
}

// 로그인 요청을 처리하는 서버 액션입니다.
export async function login(state, formData) {

  // 유효성 검사 규칙은 src/lib/rules.js에 정의되어 있습니다.
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // 유효성 검사에 실패한 경우, 에러 메시지를 반환합니다.
  // 에러 메시지는 src/lib/rules.js에 정의된 규칙에 따라 다르게 표시됩니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  // 유효성 검사 통과 후 DB에 회원가입 정보를 저장합니다.
  const {email, password} = validatedFields.data;  
  // console.log(email, password);

  // next_blog_db DB에서 users collection(테이블)을 가져옵니다.
  // users collection이 존재하지 않는 경우, 에러 메시지를 반환합니다.
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return { errors: { email: "Server error!" } };
  }

  // user email이 존재하지 않는 경우, 에러 메시지를 반환합니다.
  const exitingUser = await userCollection.findOne({ email });
  if (!exitingUser) {
    return { errors: { email: "User not found." } };
  }

  // 비밀번호를 비교하여 일치하지 않는 경우, 에러 메시지를 반환합니다.
  const isPasswordValid = await bcrypt.compare(password, exitingUser.password);
  if (!isPasswordValid) {
    return { 
      errors: { password: "Invalid password." },
      email: formData.get("email")
    };
  }

  // Create Session
  await createSession(exitingUser._id.toString());

  // Rediect to login page after successful registration.
  redirect("/dashboard");
}


// 로그아웃 요청을 처리하는 서버 액션입니다.
export async function logout() {
  const coookieStore = await cookies();
  coookieStore.delete('session');
  redirect("/");
}
