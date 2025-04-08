'use client';
import CreatePost from '@/components/ui/CreatePost';
import Modal from '@/components/ui/Modal';
import useProfile from '@/hooks/profile/useProfile';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const goBack = () => router.back();

  if (status === 'loading') {
    return (
      <Modal close={goBack} isOpen={true}>
        <p>Loading session...</p>
      </Modal>
    );
  }

  if (!session) {
    return (
      <Modal close={goBack} isOpen={true}>
        <p>Not authenticated.</p>
      </Modal>
    );
  }

  const { isLoading, error, profile } = useProfile(session.user.profile);

  return (
    <>
      <Modal close={() => {}} isOpen={isLoading}>
        <p>Loading profile...</p>
      </Modal>
      <Modal close={goBack} isOpen={Boolean(error)}>
        <p>Error: {error?.message}</p>
      </Modal>
      {!isLoading && !error && (
        <Modal
          close={goBack}
          isOpen={true}
          title="Create a post."
          profile={profile}
        >
          <CreatePost onSuccess={goBack} />
        </Modal>
      )}
    </>
  );
}
