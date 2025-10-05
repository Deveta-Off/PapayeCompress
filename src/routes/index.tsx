import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import axios from "axios";

import { UploadZone } from "../components/UploadZone";
import { QualitySettings } from "../components/QualitySettings";
import { CompressionResult } from "../components/CompressionResult";
import { ErrorMessage } from "../components/ErrorMessage";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

interface CompressionState {
  isUploading: boolean;
  quality: number;
  originalSize?: number;
  compressedURL?: string;
  compressedSize?: number;
  compressedFormat?: string;
  error?: string;
}

function HomeComponent() {
  const [state, setState] = useState<CompressionState>({
    isUploading: false,
    quality: 50,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const msg = error.response.data;
        const text = new TextDecoder("utf-8").decode(msg);
        const json = JSON.parse(text);
        const errorMessage = json["error"] || "Erreur inconnue :(";
        setState(prev => ({ ...prev, error: errorMessage }));
      } else {
        setState(prev => ({ ...prev, error: "Erreur de connexion" }));
      }
    },
    mutationFn: async (file: File) => {
      setState(prev => ({
        ...prev,
        isUploading: true,
        originalSize: file.size,
        error: undefined,
        compressedURL: undefined,
        compressedSize: undefined,
        compressedFormat: undefined,
      }));

      // File size validation
      if (file.size > 2e7) {
        setState(prev => ({
          ...prev,
          error: "Fichier trop volumineux ! Veuillez uploader un fichier < 20Mb",
          isUploading: false,
        }));
        return;
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        setState(prev => ({
          ...prev,
          error: "Format de fichier invalide ! Veuillez uploader une image",
          isUploading: false,
        }));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", state.quality.toString());

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
        onUploadProgress: (event) => {
          if (event.total) {
            // Could add progress tracking here if needed
            // const percent = Math.round((event.loaded * 100) / event.total);
          }
        },
      });

      const mime = response.headers["content-type"] || "image/jpeg";
      const format = mime.split("/")[1] || "png";
      const blob = new Blob([response.data], { type: mime });
      const url = URL.createObjectURL(blob);

      setState(prev => ({
        ...prev,
        compressedURL: url,
        compressedSize: blob.size,
        compressedFormat: format,
        isUploading: false,
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      return blob;
    },
  });

  const handleFileSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    mutation.mutate(e.target.files[0]);
  };

  const showResult = state.compressedURL && 
    state.originalSize && 
    state.compressedSize && 
    !state.isUploading;

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

      {/* Upload Zone */}
      <UploadZone
        isUploading={state.isUploading}
        onFileChange={handleFileSubmit}
        fileInputRef={fileInputRef}
      />

      {/* Settings */}
      <QualitySettings
        quality={state.quality}
        onQualityChange={(quality) => setState(prev => ({ ...prev, quality }))}
      />

      {/* Result */}
      {showResult && (
        <CompressionResult
          compressedURL={state.compressedURL!}
          originalSize={state.originalSize!}
          compressedSize={state.compressedSize!}
          compressedFormat={state.compressedFormat!}
        />
      )}

      {/* Error */}
      <ErrorMessage error={state.error || null} />
    </div>
  );
}
