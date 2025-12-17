import { useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface DocumentUploadProps {
  onUpload: (file: File, documentType: string) => void;
  isAnalyzing: boolean;
}

export default function DocumentUpload({
  onUpload,
  isAnalyzing,
}: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("contract");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Sadece PDF dosyaları yüklenebilir.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Dosya boyutu 10MB'dan büyük olamaz.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, documentType);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Doküman Tipi
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setDocumentType("contract")}
            disabled={isAnalyzing}
            className={`p-4 rounded-lg border-2 transition-all ${
              documentType === "contract"
                ? "border-blue-500 bg-blue-500/20"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="font-medium text-white text-sm">Sözleşme</p>
            <p className="text-xs text-slate-400 mt-1">
              Kira, iş, alım-satım sözleşmeleri
            </p>
          </button>

          <button
            onClick={() => setDocumentType("invoice")}
            disabled={isAnalyzing}
            className={`p-4 rounded-lg border-2 transition-all ${
              documentType === "invoice"
                ? "border-blue-500 bg-blue-500/20"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="font-medium text-white text-sm">Fatura</p>
            <p className="text-xs text-slate-400 mt-1">
              Ticari faturalar, makbuzlar
            </p>
          </button>

          <button
            onClick={() => setDocumentType("agreement")}
            disabled={isAnalyzing}
            className={`p-4 rounded-lg border-2 transition-all ${
              documentType === "agreement"
                ? "border-blue-500 bg-blue-500/20"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="font-medium text-white text-sm">Anlaşma</p>
            <p className="text-xs text-slate-400 mt-1">
              Protokol, mutabakat metinleri
            </p>
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          PDF Dosyası Yükle
        </label>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-800/30"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleChange}
            disabled={isAnalyzing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{selectedFile.name}</p>
                  <p className="text-sm text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                disabled={isAnalyzing}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-slate-300 mb-1">
                PDF dosyanızı sürükleyip bırakın
              </p>
              <p className="text-sm text-slate-500 mb-4">
                veya tıklayarak seçin
              </p>
              <p className="text-xs text-slate-600">
                Maksimum dosya boyutu: 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">
              Doküman Analizi Nasıl Çalışır?
            </h4>
            <p className="text-sm text-slate-300">
              Yüklediğiniz PDF dokümanı AI ile analiz edilir. Risk skorlaması,
              önemli maddeler, dikkat edilmesi gerekenler ve öneriler sunulur.
              Analiz süresi doküman uzunluğuna göre 30-60 saniye sürebilir.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isAnalyzing}
        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span>Analiz Ediliyor...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Dokümanı Analiz Et</span>
          </>
        )}
      </button>
    </div>
  );
}
