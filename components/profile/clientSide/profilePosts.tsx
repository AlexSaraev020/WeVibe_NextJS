"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PostType } from "@/types/post/postType";
import { getProfilePosts } from "@/actions/profile/getProfilePosts";
import { useInView } from "react-intersection-observer";
import { AiOutlineLoading } from "react-icons/ai";

interface ProfilePostsProps {
  userId: string;
}

export default function ProfilePosts({ userId }: ProfilePostsProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const { ref, inView } = useInView();

  const loadMorePosts = async () => {
    if (loadingPosts || !hasMore) return;
    setLoadingPosts(true);
    const newPosts = await getProfilePosts({
      userId,
      setLoading,
      skip,
      limit: 6,
    });
    if (newPosts.length < 6) {
      setHasMore(false);
    }
    setPosts((prev: PostType[]) => [...prev, ...newPosts]);
    setSkip((prev) => prev + 6);
    setLoadingPosts(false);
  };

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView, userId]);

  return (
    <ul className="mb-16 grid h-full w-full grid-cols-2 gap-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent sm:grid-cols-3 md:w-9/12 lg:mb-0 lg:w-8/12">
      {posts.length ? (
        posts.map((post: PostType) => (
          <li
            key={`profile-post-${post._id}`}
            className="relative flex w-full items-center justify-center"
          >
            <Image
              className="relative z-10 h-40 w-full object-cover md:h-80"
              src={post.image.url}
              alt="image"
              priority
              width={1080}
              height={1080}
            />
          </li>
        ))
      ) : loading ? (
        <div className="col-span-3 flex items-center justify-center">
          <AiOutlineLoading className="animate-spin" />
        </div>
      ) : (
        <p className="col-span-3 text-center">No posts yet</p>
      )}
      {hasMore && <div className="h-1" ref={ref} />}
      {!loading && loadingPosts && (
        <div className="flex items-start justify-center py-4">
          <AiOutlineLoading className="h-8 w-8 animate-spin" />
        </div>
      )}
    </ul>
  );
}
