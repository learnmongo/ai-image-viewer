import { HowItsBuiltPage } from '@/components/how-its-built/HowItsBuiltPage';

export const metadata = {
  title: 'Project guide | AI Image Viewer',
  description:
    'Companion to the MongoDB tutorial. Learn how the repository is organized and what each layer of search does.',
};

export default function HowItsBuiltRoute() {
  return <HowItsBuiltPage />;
}
