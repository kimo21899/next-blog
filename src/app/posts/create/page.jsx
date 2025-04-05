import { createPost } from "@/actions/posts";
import BlogForm from "@/components/BlogForm";
import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";

export default async function CreatePost() {

  // Get the auth user from cookies
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="container w-1/2">
      <h1 className="title">Create a new post</h1>
      <BlogForm handler={createPost} />
    </div>
  );
}
