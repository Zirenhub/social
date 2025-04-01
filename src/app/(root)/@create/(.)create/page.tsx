'use client';
import CreatePost from '@/components/ui/CreatePost';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <Modal close={() => router.back()} isOpen={true} title="Create a post.">
      <CreatePost onSuccess={() => router.back()} />
    </Modal>
  );
}
