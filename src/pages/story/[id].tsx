
import { IStory } from '@/types/IStory';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface StoryProps {
  story: IStory;
}

export default function StoryPage({ story }: StoryProps) {
  const {title, author} = story;
  const [points, setPoints] = useState(story.points);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleThumbsUp = () => {
    setPoints(points + 1);
  };

  const handleThumbsDown = () => {
    setPoints(points - 1);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>By {author}</p>
      <p>{points} points</p>
      <button onClick={handleThumbsUp}>Thumbs Up</button>
      <button onClick={handleThumbsDown}>Thumbs Down</button>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${API_BASE_URL}/api/top-stories`);
  const data = await response.json();
  const storyIds = data.map((story: IStory) => story.id);
  const paths = storyIds.map((id: number) => ({
    params: { id: id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
    const { id } = params || {};
  
    if (!id) {
      return { notFound: true };
    }
  
    const response = await fetch(`${API_BASE_URL}/api/story/${id}`);
    
    const data = await response.json();
    const story = data

  
    return { props: { story } };
  };

  