"use server";

import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { BlogPostSchema } from "@/lib/rules";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 블로그 글등록 액션정의
export async function createPost(state, formData) {
  // 로그인 여부
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const title = formData.get("title");
  const content = formData.get("content");

  // 유효성 검사 규칙은 src/lib/rules.js에 정의되어 있습니다.
  const validatedFields = BlogPostSchema.safeParse({
    title,
    content,
  });

  // 유효성 검사에 실패한 경우, 에러 메시지를 반환합니다.
  // 에러 메시지는 src/lib/rules.js에 정의된 규칙에 따라 다르게 표시됩니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      title: title,
      content: content,
    };
  }

  // Save to DB
  try {
    // getCollection은 src/lib/db.js에 정의되어 있습니다.
    // DB에 연결된 후, posts collection을 가져옵니다.
    const postsCollection = await getCollection("posts");
    if( !postsCollection) {
      return { errors: { title: "Server error!" } };
    }    
    // 연결된 posts collection에 블로그 글을 추가합니다.
    await postsCollection.insertOne({    
      title: validatedFields.data.title,
      content: validatedFields.data.content,
      userId: ObjectId.createFromHexString(user.userId)     
    });
  } catch (error) {
    return { errors: { title: error.message } };
  }
  // 글 작성 후, Dashboard 리다이렉트합니다.
  redirect("/dashboard");
}

// 블로그 글수정 액션정의
export async function updatePost(state, formData) {
  // 로그인 여부
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const postId = formData.get("postId");
  const title = formData.get("title");
  const content = formData.get("content");

  // 유효성 검사 규칙은 src/lib/rules.js에 정의되어 있습니다.
  const validatedFields = BlogPostSchema.safeParse({
    title,
    content,
  });

  // 유효성 검사에 실패한 경우, 에러 메시지를 반환합니다.
  // 에러 메시지는 src/lib/rules.js에 정의된 규칙에 따라 다르게 표시됩니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      title: title,
      content: content,
    };
  }

  // Find postId in DB
  const postsCollection = await getCollection("posts");
  const post = await postsCollection.findOne({
    _id: ObjectId.createFromHexString(postId)
  });

  // 작성자와 로그인 한 사람이 다르면, 홈으로 리다이렉트합니다.
  if (user.userId !== post.userId.toString()) return redirect("/");

  // Save to DB
  postsCollection.findOneAndUpdate(
    { _id: post._id },
    {
      $set: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
      },
    }
  );
  // 글 작성 후 Dashboard으로 리다이렉트합니다.
  redirect("/dashboard");
}


// 블로그 글삭제 액션정의
export async function deletePost(formData) {
  // 로그인 여부
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // Find postId in DB
  const postId = formData.get("postId");
  const postsCollection = await getCollection("posts");
  const post = await postsCollection.findOne({
    _id: ObjectId.createFromHexString(postId)
  });

  // 작성자와 로그인 한 사람이 다르면, 홈으로 리다이렉트합니다.
  if (user.userId !== post.userId.toString()) return redirect("/");

  // Save to DB
  postsCollection.findOneAndDelete({ _id: post._id });

  // 글 삭제 후 Dashboard으로 리다이렉트합니다.
  // redirect("/dashboard");
  revalidatePath("/dashboad");
}