"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PostType } from "@/types/post/postType";
import { getProfilePosts } from "@/actions/profile/getProfilePosts";
import { useInView } from "react-intersection-observer";
import { AiOutlineLoading } from "react-icons/ai";
import PostFullScreen from "./postFullScreen";
import { usePostsNav } from "@/contexts/posts/postsNavContext";

interface ProfilePostsProps {
  userId: string;
}

export default function ProfilePosts({ userId }: ProfilePostsProps) {
  const { posts, setPosts } = usePostsNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [showPostFullScreen, setShowPostFullScreen] = useState<boolean>(false);
  const [skip, setSkip] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [openPost, setOpenPost] = useState<PostType | null>(null);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const newPosts = await getProfilePosts({
      userId,
      setLoading,
      setSkip,
      setHasMore,
      skip,
      limit: 6,
    });
    if (newPosts.length < 6) {
      setHasMore(false);
    }
    setPosts((prev: PostType[]) => [...prev, ...newPosts]);
    setLoading(false);
  }, [hasMore, loading, skip]);

  const handleOpenPost = (post: PostType) => {
    setOpenPost(post);
    setShowPostFullScreen(true);
  };

  useEffect(() => {
    setPosts(() => []);
    setSkip(0);
    setHasMore(true);
  }, [userId]);

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  return (
    <>
      {showPostFullScreen && openPost && (
        <PostFullScreen
          post={openPost}
          setPosts={setPosts}
          setShowPostFullScreen={setShowPostFullScreen}
        />
      )}
      <ul className="mb-16 grid h-full w-full grid-cols-2 gap-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent sm:grid-cols-3 md:w-9/12 lg:mb-0 lg:w-8/12">
        {posts.length ? (
          posts.map((post: PostType) => (
            <li
              key={post._id}
              onClick={() => handleOpenPost(post)}
              className="relative flex w-full items-center justify-center hover:cursor-pointer"
            >
              <Image
                className="relative z-10 h-40 w-full rounded-xl border-2 border-transparent object-cover transition-all duration-500 hover:border-postBackground/60 md:h-80"
                src={post.image.url}
                alt="image"
                priority
                width={1080}
                height={1080}
              />
            </li>
          ))
        ) : (
          !hasMore && <p className="col-span-3 text-center">No posts yet</p>
        )}
        {hasMore && (
          <div
            ref={ref}
            className="col-span-3 flex w-full items-center justify-center pb-24 md:pb-8"
          >
            {loading && <AiOutlineLoading className="h-8 w-8 animate-spin" />}
          </div>
        )}
      </ul>
    </>
  );
}
