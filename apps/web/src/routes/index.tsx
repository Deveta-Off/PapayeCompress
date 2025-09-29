import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [state, setState] = useState<{
    progress: number;
    chosenQuality: number;
    isUploading: boolean;
    originalSize?: number;
    compressedURL?: string;
    compressedSize?: number;
    compressedFormat?: string;
    uploadError?: string;
  }>({
    chosenQuality: 50,
    progress: 0,
    isUploading: false,
    uploadError: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const msg = error.response.data;
        const text = new TextDecoder("utf-8").decode(msg);
        const json = JSON.parse(text);
        if (!json["error"]) {
          setState((s) => ({
            ...s,
            uploadError: "Erreur inconnue :(",
            isUploading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            uploadError: json["error"],
            isUploading: false,
          }));
        }
      }
    },
    mutationFn: async (file: File) => {
      setState((s) => ({
        ...s,
        isUploading: true,
        originalURL: URL.createObjectURL(file),
        originalSize: file.size,
        progress: 0,
        uploadError: undefined,
      }));

      if (file.size > 2e7) {
        setState((s) => ({
          ...s,
          uploadError:
            "Fichier trop volumineux ! Veuillez uploader un fichier < 20Mb",
          isUploading: false,
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setState((s) => ({
          ...s,
          uploadError:
            "Format de fichier invalide ! Veuillez uploader une image",
          isUploading: false,
        }));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", state.chosenQuality.toString());

      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer", // Important or image will NOT be translated correctly
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setState((s) => ({ ...s, progress: percent }));
          }
        },
      });

      const mime = response.headers["content-type"] || "image/jpeg";
      const format = mime.split("/")[1] || "png";
      const blob = new Blob([response.data], { type: mime });
      const compressedURL = URL.createObjectURL(blob);

      setState((s) => ({
        ...s,
        isUploading: false,
        compressedURL,
        compressedSize: blob.size,
        compressedFormat: format,
      }));
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input to enable inputing the same image
      return blob;
    },
  });

  const handleFileSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    mutation.mutate(e.target.files[0]);
  };

  return (
    <div className="container h-screen m-auto flex flex-col items-center justify-center max-w-2xl px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold flex items-center justify-center gap-2">
          PapayeCompress <span>🐈</span>
        </h1>
        <p className="text-gray-600 mt-5">
          Compressez vos images en un clic ✨<br />
          Formats supportés :{" "}
          <span className="font-medium">JPG, PNG, WEBP</span>
        </p>
      </div>

      {/* Upload zone */}
      <form className="w-full select-none">
        <label
          htmlFor="file_upload"
          className="block relative overflow-hidden p-16 text-center rounded-2xl shadow-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-white transition cursor-pointer"
        >
          <p className="text-lg text-gray-500">
            Cliquez ou déposez une image ici
          </p>

          <AnimatePresence>
            {state.isUploading && (
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

        {/* Settings */}
        <div className="p-5 mt-6 rounded-xl shadow-md border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ Paramètres
          </h2>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="quality_range"
                className="text-sm font-semibold text-gray-700"
              >
                Qualité
              </label>
              <span
                className="text-sm font-semibold text-accent "
                id="quality_value"
              >
                {state.chosenQuality}%
              </span>
            </div>

            <input
              type="range"
              id="quality_range"
              min="0"
              max="100"
              defaultValue={state.chosenQuality}
              className="w-full h-2 rounded-lg bg-gray-200 appearance-none cursor-pointer accent-accent"
              onChange={(e) => {
                setState((s) => ({
                  ...s,
                  chosenQuality: parseInt(e.target.value, 10) || 0,
                }));
              }}
            />
          </div>
        </div>

        <input
          ref={fileInputRef}
          id="file_upload"
          type="file"
          onChange={handleFileSubmit}
          accept="image/*"
          className="hidden"
        />
      </form>

      {/* Result */}
      {state.compressedURL &&
        state.originalSize &&
        state.compressedSize &&
        !state.isUploading && (
          <motion.div
            className={`w-full mt-8 p-4 rounded-xl border text-center ${
              state.compressedSize > state.originalSize
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2
              className={`font-semibold text-lg mb-2 ${
                state.compressedSize > state.originalSize
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              Image compressée{" "}
              {state.compressedSize > state.originalSize ? "? ⚠️" : "✅"}
            </h2>
            <p className="text-gray-600 mb-3">
              {formatFileSize(state.originalSize)} →{" "}
              {formatFileSize(state.compressedSize)} <br />
              <span
                className={`font-bold ${
                  state.compressedSize > state.originalSize
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {100 -
                  Math.round((state.compressedSize * 100) / state.originalSize)}
                % d’espace gagné{" "}
                {state.compressedSize > state.originalSize ? "😬" : "🎉"}
              </span>
            </p>
            <a
              href={state.compressedURL}
              download={`compressed.${state.compressedFormat}`}
            >
              <button
                className={`w-full p-2 mt-5 flex justify-center items-center gap-3 rounded-sm text-white border-1 transition-all ${
                  state.compressedSize > state.originalSize
                    ? "bg-red-500 hover:bg-red-600 border-red-200"
                    : "bg-green-500 hover:bg-green-600 border-green-200"
                }`}
              >
                <Download /> Télécharger l'image compressée{" "}
              </button>
            </a>
          </motion.div>
        )}

      {/* Error */}
      {state.uploadError && (
        <AnimatePresence>
          <motion.div
            className="mt-5 p-3 rounded-lg bg-red-600 text-white text-center shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ Erreur lors de l’upload : {state.uploadError}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
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

export default HomeComponent;