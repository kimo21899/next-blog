"use server";

// import "server-only" 
// 무조건 server 컴포넌트로 인식되며, 클라이언트 컴포넌트에서 사용할 수 없습니다.

export default async function myFunction() {
  console.log("myFunction Called");
}