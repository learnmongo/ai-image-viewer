import { ObjectId } from 'mongodb';

export interface RawModelResponse {
  model: string;
  response: string;
}

export interface ImageDoc {
  _id: ObjectId;
  title: string;
  description: string;
  summary: string;
  feelings?: string[];
  hues?: string[];
  colors: string[];
  tags?: string[];
  raw?: RawModelResponse[];
} 