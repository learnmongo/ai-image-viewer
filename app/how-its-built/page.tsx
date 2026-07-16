import { HowItsBuiltPage } from '@/components/how-its-built/HowItsBuiltPage';

export const metadata = {
  title: "How it's built | AI Image Viewer",
  description:
    'Architecture, MongoDB search layers, processing pipeline, and an honest note on how LLMs fit into the workflow.',
};

export default function HowItsBuiltRoute() {
  return <HowItsBuiltPage />;
}
