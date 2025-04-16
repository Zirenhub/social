"use client";

import { toast } from "react-toastify";

export default function Message() {
  async function handleMessage() {
    toast.success("Message!");
  }

  return (
    <button className="w-full secondary-button px-3 py-2" onClick={handleMessage}>
      Message
    </button>
  );
}
