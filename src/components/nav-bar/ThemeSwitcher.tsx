import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LoaderPlaceholder from '../loader/LoaderPlaceholder';

export default function ThemeSwitcher() {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the theme switcher after client-side hydration
  if (!isMounted) return <LoaderPlaceholder />;

  function styledButton({
    icon,
    onClick,
    style,
  }: {
    icon: React.JSX.Element;
    onClick: () => void;
    style: string;
  }) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${style} p-2 cursor-pointer rounded-full transition-colors duration-300`}
      >
        {icon}
      </motion.button>
    );
  }

  if (resolvedTheme === 'dark') {
    return styledButton({
      icon: <Sun size={28} color="yellow" fill="yellow" />,
      onClick: () => setTheme('light'),
      style: 'hover:bg-white/40',
    });
  } else {
    return styledButton({
      icon: <Moon size={28} color="gray" fill="gray" />,
      onClick: () => setTheme('dark'),
      style: 'hover:bg-black/10',
    });
  }
}
