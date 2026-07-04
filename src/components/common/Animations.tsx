import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);
