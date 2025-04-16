import { auth } from "@/auth";

export default async function getSession() {
  const session = await auth();

  if (!session) {
    throw new Error("Session not found");
  }
  return session;
}
