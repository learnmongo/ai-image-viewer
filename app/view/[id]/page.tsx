import clientPromise from '@/lib/mongo';
import { Box, Heading, Image, Tag, Wrap } from '@chakra-ui/react';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

type ImageDoc = {
  _id: { $oid: string };
  title: string;
  description: string;
  summary: string;
  tags: string[];
  colors: string[];
  raw: string;
};



export default async function ImagePage({ params }: { params: { id: string } }) {
  const id = params.id;

  const client = await clientPromise;
  const db = client.db('view_vector');
  const collection = db.collection('images');

  const doc = await collection.findOne({ _id: new ObjectId(id) });

  if (!doc) return notFound();

  const imageDoc = doc as unknown as ImageDoc;

  const fileName = `${id}.jpg`;
  const localImagePath = path.join(process.cwd(), 'public', 'resources', fileName);

  const fileExists = fs.existsSync(localImagePath);
  if (!fileExists) return notFound();

  const background = `linear-gradient(135deg, ${imageDoc.colors?.[0]}cc, ${imageDoc.colors?.[1]}cc, ${imageDoc.colors?.[2]}cc)`;

  return (
    <Box minH="100vh" bg={background} color="white" p={8}>
      <Heading size="lg" mb={4}>
        {imageDoc.title}
      </Heading>
      <Image src={`/resources/${fileName}`} alt={imageDoc.title} maxW="600px" rounded="md" title={imageDoc.raw} />
      <Box mt={4} bg="blackAlpha.600" p="5" rounded="md" borderWidth="1px" borderColor="border.disabled">
        <p>{imageDoc.summary}</p>
        <Wrap mt={2}>
          {/*imageDoc.tags.map((tag) => (
            <Tag key={tag} colorScheme="whiteAlpha">
              {tag}
            </Tag>
          ))*/}
        </Wrap>
      </Box>
    </Box>
  );
}

