'use client';
import CreatePost from '@/components/ui/CreatePost';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <Modal close={goBack} isOpen={true} title="Create a post.">
      <CreatePost onSuccess={goBack} />
    </Modal>
  );
}
