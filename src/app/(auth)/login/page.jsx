"use client"

import { useActionState } from "react";
import { login } from "@/actions/auth";
import Link from "next/link";

export default function Login() {

  // useActionState는 서버 액션을 클라이언트에서 사용할 수 있도록 해주는 훅입니다.
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="container w-1/2">
      <h1 className="title">Login</h1>     
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" defaultValue={state?.email} required />
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
          {state?.errors?.password && (
            <p className="error">{state.errors.password}</p>
          )}
        </div>
        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary w-full">
            {isPending ? "Loading..." : "Login"}
          </button>          
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="text-link">
            or register here
          </Link>
          </div>
      </form>
    </div>
  );
}
