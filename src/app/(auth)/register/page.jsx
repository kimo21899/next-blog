"use client"

import { useActionState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";

export default function Register() {

  // useActionState는 서버 액션을 클라이언트에서 사용할 수 있도록 해주는 훅입니다.
  const [state, action, isPending] = useActionState(register, undefined);

  return (
    <div className="container w-1/2">
      <h1 className="title">Register</h1>     
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" defaultValue={state?.name} />
          {state?.errors?.name && (
            <p className="error">{state.errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" defaultValue={state?.email} />
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          {state?.errors?.password && (
            <div className="error">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-4">
                {state.errors.password.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" name="confirmPassword" />
          {state?.errors?.confirmPassword && (
            <p className="error">{state.errors.confirmPassword}</p>
          )}
        </div>
        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary w-full">
            {isPending ? "Loading..." : "Register"}
          </button>          
        </div>
        <div className="flex items-center justify-center gap-4">
            <Link href="/" className="text-link">
              already have an account? login
            </Link>
          </div>
      </form>
    </div>
  );
}
