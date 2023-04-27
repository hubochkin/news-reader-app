import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/styles.module.css';
import { GetStaticPaths } from 'next';
import { getTopStories } from './api/top-stories';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
interface Story {
  id: number;
  title: string;
  author: string;
  points: number;
}

export default function Home({ stories: initialStories }: { stories: Story[] }) {
  const [stories, setStories] = useState<Story[]>(initialStories);

  return (
    <div>
      <Head>
        <title>News Reader App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <h1>Top Stories</h1>
          <div className={styles.grid}>
            {stories.map((story) => (
              <li key={story.id} className={styles.storyItem}>
                <Link href={`/story/${story.id}`}>
                  <h2 className={styles.storyTitle}>{story.title}</h2>
                  <p className={styles.storyMeta}>
                    {story.author} | {story.points} points
                  </p>
                </Link>
              </li>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <p>Created by [Your Name]</p>
      </footer>
    </div>
  );
}



export async function getStaticProps() {

  const data = await getTopStories()
  const stories = data;
  return {
    props: {
      stories,
    },
  };
}