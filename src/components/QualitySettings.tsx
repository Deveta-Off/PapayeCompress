interface QualitySettingsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
}

export function QualitySettings({ quality, onQualityChange }: QualitySettingsProps) {
  return (
    <div className="p-5 mt-6 rounded-xl shadow-md border border-gray-200 bg-white w-full">
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
            className="text-sm font-semibold text-accent"
            id="quality_value"
          >
            {quality}%
          </span>
        </div>

        <input
          type="range"
          id="quality_range"
          min="1"
          max="100"
          value={quality}
          className="w-full h-2 rounded-lg bg-gray-200 appearance-none cursor-pointer accent-accent"
          onChange={(e) => {
            onQualityChange(parseInt(e.target.value, 10) || 0);
          }}
        />
      </div>
    </div>
  );
}