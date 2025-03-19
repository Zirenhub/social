'use client';
import { toast } from 'react-toastify';

export default function Follow() {
  async function handleFollow() {
    toast.success('Followed!');
  }

  return (
    <button className="primary-button" onClick={handleFollow}>
      Follow
    </button>
  );
}
