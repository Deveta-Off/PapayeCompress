import { AnimatePresence, motion } from "framer-motion";

interface ErrorMessageProps {
  error: string | null | undefined;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="mt-5 p-3 rounded-lg bg-red-600 text-white text-center shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        ⚠️ Erreur lors de l'upload : {error}
      </motion.div>
    </AnimatePresence>
  );
}