import { IStory } from "@/types/IStory";
import { NextApiRequest, NextApiResponse } from "next";

const API_BASE_URL = process.env.API_BASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(`${API_BASE_URL}/search?tags=front_page`).then(res => res.json())

  const topStoryIds = response.hits
  
  const stories: IStory[] = topStoryIds.map((story:any) => ({
    id: story.objectID,
    title: story.title,
    author: story.author,
    points: story.points,
  }));
    res.status(200).json(stories);
}
