import { IStory } from '@/types/IStory';
import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.API_BASE_URL;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  const data = await response.json();

  const story: IStory = {
    id: data.id,
    title: data.title,
    author: data.author,
    points: data.points,
  };

  res.status(200).json(story);
}
