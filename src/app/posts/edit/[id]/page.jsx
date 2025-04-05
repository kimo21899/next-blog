import { updatePost } from "@/actions/posts";
import BlogForm from "@/components/BlogForm";
import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function EditPost({params}) {
  // Id parameter from page params
  const {id} = await params  

  // Get the auth user from cookies
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const postsCollection = await getCollection("posts");
  let post = null;
  if (id.length === 24 && postsCollection) {
    post = await postsCollection.findOne({
      _id : ObjectId.createFromHexString(id)
    });
    post = JSON.parse(JSON.stringify(post)); // Convert ObjectId to string
    if(user.userId !== post.userId){
      redirect("/");
    }
  }else {
    post = null
  }

  return (
    <div className="container w-1/2">
      <h1 className="title">Edit your post</h1>
      {post? <BlogForm post={post} handler={updatePost} /> : <p>Failed to fetch the data from database.</p>}
    </div>
  )
}