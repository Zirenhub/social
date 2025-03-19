'use client';
import { toast } from 'react-toastify';

export default function Message() {
  async function handleMessage() {
    toast.success('Message!');
  }

  return (
    <button className="secondary-button" onClick={handleMessage}>
      Message
    </button>
  );
}
