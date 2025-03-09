import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logOut } from '@/app/api/auth/actions';
import LoaderPlaceholder from '../loader/LoaderPlaceholder';
import { motion } from 'framer-motion';
import { LogOut as LogOutIcon } from 'lucide-react';

export default function LogOut() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogOut() {
    startTransition(async () => {
      try {
        const result = await logOut();
        if (result.success) {
          router.replace('/');
        }
      } catch (error) {
        toast.error('An error occurred during logout');
      }
    });
  }

  if (isPending) {
    return <LoaderPlaceholder />;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleLogOut}
      className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-lg hover:shadow-sky-300/20 transition-all duration-300"
    >
      <LogOutIcon size={20} className="text-white" />
    </motion.button>
  );
}
