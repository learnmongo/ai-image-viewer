import { ObjectId } from 'mongodb';
import clientPromise from '../mongo';
import { ImageDoc } from '@/types/image';

const COLLECTION = 'images';
const DB = 'view_vector';

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB).collection(COLLECTION);
}

export async function getImageById(id: string): Promise<ImageDoc | null> {
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) }) as Promise<ImageDoc | null>;
}

async function getImagesByField(field: string, value: string): Promise<ImageDoc[]> {
  const col = await getCollection();
  return col.find({ [field]: value }).toArray() as Promise<ImageDoc[]>;
}

export function getImagesByTag(tag: string) {
  return getImagesByField('tags', tag);
}
export function getImagesByFeeling(feeling: string) {
  return getImagesByField('feelings', feeling);
}
export function getImagesByHue(hue: string) {
  return getImagesByField('hues', hue);
}
export function getImagesByColor(color: string) {
  return getImagesByField('colors', color);
} 