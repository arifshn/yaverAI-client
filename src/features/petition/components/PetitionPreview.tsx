import { Download, Eye, Printer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PetitionPreviewProps {
  id: number;
  templateName: string;
  content: string;
  createdAt: string;
  onDownload: () => void;
  isDownloading?: boolean;
}

export default function PetitionPreview({
  id,
  templateName,
  content,
  createdAt,
  onDownload,
  isDownloading = false,
}: PetitionPreviewProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${templateName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 {
                color: #1e293b;
                margin-bottom: 20px;
                font-size: 18px;
              }
              p {
                margin-bottom: 15px;
                text-align: justify;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <h1>${templateName}</h1>
            <div>${content
              .split("\n\n")
              .map((p) => `<p>${p}</p>`)
              .join("")}</div>
            <div class="footer">
              Oluşturulma Tarihi: ${new Date(createdAt).toLocaleDateString(
                "tr-TR"
              )} | Yaver AI ile oluşturulmuştur
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm">Önizleme Modu</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <span className="text-sm text-slate-400">
            Oluşturuldu:{" "}
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm">Yazdır</span>
          </button>

          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span className="text-sm">İndiriliyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-sm">PDF İndir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl">
        {/* Paper Effect */}
        <div className="p-12 min-h-[800px]">
          {/* Header */}
          <div className="border-b-2 border-slate-300 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-center text-slate-800">
              {templateName}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-4 text-justify">
            {content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="leading-relaxed whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-center text-sm text-slate-500">
            <p>
              Oluşturulma Tarihi:{" "}
              {new Date(createdAt).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-1">Yaver AI ile oluşturulmuştur</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-400 mb-1">
              Önemli Bilgilendirme
            </h3>
            <p className="text-sm text-slate-300">
              Bu dilekçe AI tarafından oluşturulmuştur. Resmi kurumlara
              göndermeden önce bir hukuk uzmanına danışmanız önerilir. Dilekçeyi
              PDF olarak indirip yazdırabilir veya doğrudan yazdırabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
