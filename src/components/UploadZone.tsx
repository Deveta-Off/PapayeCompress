import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";

interface UploadZoneProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function UploadZone({ isUploading, onFileChange, fileInputRef }: UploadZoneProps) {
  return (
    <form className="w-full select-none">
      <label
        htmlFor="file_upload"
        className="block relative overflow-hidden p-16 text-center rounded-2xl shadow-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-white transition cursor-pointer"
      >
        <p className="text-lg text-gray-500">
          Cliquez ou déposez une image ici
        </p>

        <AnimatePresence>
          {isUploading && (
            <motion.div
              className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2Icon className="animate-spin text-indigo-600 mb-2" />
              <span>Traitement en cours...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      <input
        ref={fileInputRef}
        id="file_upload"
        type="file"
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />
    </form>
  );
}