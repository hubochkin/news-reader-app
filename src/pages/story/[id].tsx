
import { IStory } from '@/types/IStory';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.API_BASE_URL || '';
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface StoryProps {
  story: IStory;
}

export default function StoryPage({ story }: StoryProps) {
  const { title, author, id, points } = story;
  const [status, setStatus] = useState<string>('neutral');
  const router = useRouter();
  const [storedObj, setStoredObj] = useState({} as any);


  useEffect(() => {
    if (!localStorage.getItem('myObj')) {

      // Create a new object with a neutral status
      const newObj = { [id]: { status: 'neutral' } };
      // create localStorage myObj 
      localStorage.setItem('myObj', JSON.stringify(newObj));


    }
    const data = localStorage.getItem('myObj') || '{}';
    const myStorage = JSON.parse(data);



    if (!myStorage[id] || myStorage[id]?.status) {
      
      const newObj = { ...myStorage, [id]: { status: 'neutral' } };

      localStorage.setItem('myObj', JSON.stringify(newObj));
      setStoredObj(newObj)
    }
    const status = myStorage[id]?.status;
    status && setStatus(status);
  }, [id]);




  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleThumbsUp = () => {
    const newObj = { ...storedObj, [id]: { status: 'active' } };

    localStorage.setItem('myObj', JSON.stringify(newObj));
    setStatus('active');
    console.log(newObj)
  };

  const handleThumbsDown = () => {
    const newObj = { ...storedObj, [id]: { status: 'inactive' } };
    console.log(newObj)
    localStorage.setItem('myObj', JSON.stringify(newObj));
    setStatus('inactive');
  };

  


  return (
    <div>
      <h1>{title}</h1>
      <p>By {author}</p>
      <p>{points} points</p>
      <div style={{ display: 'flex' }}>
        Icon status: {status}
        <div onClick={handleThumbsUp} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faThumbsUp} />
        </div>
        <div onClick={handleThumbsDown} style={{ cursor: 'pointer', marginLeft: '10px' }}>
          <FontAwesomeIcon icon={faThumbsDown} />
        </div>
      </div>

    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {

  const response = await fetch(`${API_BASE_URL}/search?tags=front_page`).then(res => res.json())

  const data = response.hits
  const storyIds = data.map((story: any) => story.objectID);
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
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  const data = await response.json();
  const story = data


  return { props: { story } };
};

