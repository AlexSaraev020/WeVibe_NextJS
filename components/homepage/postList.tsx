"use client";
import { PostType } from "@/types/post/postType";
import React, { useCallback, useEffect, useState } from "react";
import Post from "../cards/postCard/post";
import { getPosts } from "@/actions/posts/getPosts";
import { useInView } from "react-intersection-observer";
import { AiOutlineLoading } from "react-icons/ai";
import { usePostsNav } from "@/contexts/posts/postsNavContext";

export const PostList = () => {
  const { posts, setPosts } = usePostsNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView])

  useEffect(() => {
    setPosts(() => []);
    setSkip(0);
    setHasMore(true);
  }, []);
  
  const loadMorePosts = useCallback (async () => {
    console.log(posts);
    if (!hasMore || loading) return;
    setLoading(true);
    const newPosts = await getPosts({
      skip,
      limit: 3,
      setHasMore,
      setSkip,
      setLoading,
    });
    if (Array.isArray(newPosts) && newPosts.length) {
      setPosts((prev: PostType[]) => [...prev, ...newPosts]);
    }
    setLoading(false);
  }, [hasMore, loading, skip]);

  return (
    <ul className="flex w-full h-full flex-col items-start justify-start py-5 md:w-10/12 lg:w-6/12">
      {posts.map((post: PostType) => (
        <li key={post._id} className="w-full mb-4 md:mb-10 xl:mb-16">
          <Post setPosts={setPosts} post={post} />
        </li>
      ))}
      {hasMore && (
        <div
          ref={ref}
          className="flex w-full items-center justify-center pb-24 md:pb-8"
        >
          {loading && <AiOutlineLoading className="h-8 w-8 animate-spin" />}
        </div>
      )}
    </ul>
  );
};
