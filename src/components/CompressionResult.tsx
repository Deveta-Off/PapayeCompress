import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface CompressionResultProps {
  compressedURL: string;
  originalSize: number;
  compressedSize: number;
  compressedFormat: string;
}

export function CompressionResult({
  compressedURL,
  originalSize,
  compressedSize,
  compressedFormat,
}: CompressionResultProps) {
  const isLarger = compressedSize > originalSize;
  const compressionRatio = 100 - Math.round((compressedSize * 100) / originalSize);

  return (
    <motion.div
      className={`w-full mt-8 p-4 rounded-xl border text-center ${
        isLarger
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2
        className={`font-semibold text-lg mb-2 ${
          isLarger ? "text-red-600" : "text-green-600"
        }`}
      >
        Image compressée {isLarger ? "? ⚠️" : "✅"}
      </h2>
      <p className="text-gray-600 mb-3">
        {formatFileSize(originalSize)} → {formatFileSize(compressedSize)} <br />
        <span
          className={`font-bold ${
            isLarger ? "text-red-600" : "text-green-600"
          }`}
        >
          {compressionRatio}% d'espace gagné {isLarger ? "😬" : "🎉"}
        </span>
      </p>
      <a href={compressedURL} download={`compressed.${compressedFormat}`}>
        <button
          className={`w-full p-2 mt-5 flex justify-center items-center gap-3 rounded-sm text-white border-1 transition-all ${
            isLarger
              ? "bg-red-500 hover:bg-red-600 border-red-200"
              : "bg-green-500 hover:bg-green-600 border-green-200"
          }`}
        >
          <Download /> Télécharger l'image compressée
        </button>
      </a>
    </motion.div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " O";
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + " Ko";
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(2) + " Mo";
  const gb = mb / 1024;
  return gb.toFixed(2) + " Go";
}