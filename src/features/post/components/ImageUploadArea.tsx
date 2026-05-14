import { useRef } from "react";
import { Camera, X } from "lucide-react";

interface ImageUploadAreaProps {
  images: (File | null)[];
  onImageChange: (index: number, file: File | null) => void;
}

export default function ImageUploadArea({ images, onImageChange }: ImageUploadAreaProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-white/70 font-semibold" style={{ fontSize: "0.82rem" }}>
        Hình ảnh
      </p>
      <div className="grid grid-cols-3 gap-3">
        {images.map((file, index) => (
          <div key={index} className="flex flex-col gap-1">
            {index === 0 && (
              <span className="text-white/30" style={{ fontSize: "0.68rem" }}>(Ảnh bìa)</span>
            )}
            <div
              className="relative flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all"
              style={{
                width: "100%",
                height: "100px",
                border: file ? "1px solid rgba(34,211,238,0.3)" : "1px dashed rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.03)",
              }}
              onClick={() => !file && inputRefs.current[index]?.click()}
            >
              {file ? (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onImageChange(index, null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                  >
                    <X size={10} className="text-white" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera size={18} className="text-white/25" />
                  <span className="text-white/25" style={{ fontSize: "0.68rem" }}>Thêm ảnh</span>
                </div>
              )}
            </div>
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImageChange(index, f);
                e.target.value = "";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
