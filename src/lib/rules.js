import { z } from "zod";

// 회원가입에 필요한 유효성 검사 규칙을 정의합니다.
// 회원가입 시 이메일, 비밀번호, 비밀번호 확인을 검사합니다.
export const RegisterFormSchema = z
  .object({
    name: z.string().min(1, { message: "Not be empty" }).trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(1, { message: "Not be empty" })
      .min(5, { message: "Be at least 5 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  // 비밀번호와 비밀번호 확인이 일치하는지 검사합니다.
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password fields do not match.",
        path: ["confirmPassword"],
      });
    }
  });


// 로그인시 이메일, 비밀번호를 검사합니다.
export const LoginFormSchema = z
.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(1, { message: "Not be empty" })
    .trim()
});