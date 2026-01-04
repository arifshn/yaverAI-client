import { Download, Eye, Printer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PetitionPreviewProps {
  id: number;
  templateName: string;
  content: string;
  createdAt: string | null;
  onDownload: () => void;
  isDownloading?: boolean;
  signerName?: string;
  signerPhone?: string;
  signerAddress?: string; // ✅ YENİ
  institutionName?: string;
}

export default function PetitionPreview({
  templateName,
  content,
  createdAt,
  onDownload,
  isDownloading = false,
  signerName,
  signerPhone,
  signerAddress, // ✅ YENİ
  institutionName
}: PetitionPreviewProps) {
  // ... (formatDate functions remain same) ...
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Tarih belirtilmemiş";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz tarih";
      }
      return date;
    } catch {
      return "Geçersiz tarih";
    }
  };

  const getFormattedDate = (format: "relative" | "full" | "short") => {
    const date = formatDate(createdAt);

    if (typeof date === "string") return date;

    switch (format) {
      case "relative":
        return formatDistanceToNow(date, { addSuffix: true, locale: tr });
      case "full":
        return date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "short":
        return date.toLocaleDateString("tr-TR");
      default:
        return "Tarih belirtilmemiş";
    }
  };

  // Determine the header text
  const headerText = institutionName ? institutionName : templateName;

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${templateName}</title>
            <style>
              @page {
                size: A4;
                margin: 2cm;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 11pt; /* Slightly smaller to fit more content */
                line-height: 1.4;
                color: #000;
                padding: 0;
                margin: 0;
                width: 100%;
              }
              .date-header {
                text-align: right;
                margin-bottom: 24px;
              }
              h1 {
                text-align: center;
                font-size: 12pt;
                font-weight: bold;
                margin-top: 0;
                margin-bottom: 24px;
                text-transform: uppercase;
              }
              p {
                margin-bottom: 8px;
                text-align: justify;
                white-space: pre-wrap;
              }
              .footer-container {
                margin-top: 48px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                page-break-inside: avoid;
              }
              .footer-left {
                text-align: left;
                width: 45%;
              }
              .footer-right {
                text-align: center;
                width: 35%;
              }
              .watermark {
                 position: fixed;
                 bottom: 0.5cm;
                 left: 0;
                 width: 100%;
                 text-align: center;
                 font-size: 7pt;
                 color: #ddd;
                 pointer-events: none;
              }
            </style>
          </head>
          <body>
            <div class="date-header">
               ${getFormattedDate("short")}
            </div>

            <h1>${headerText}</h1>
            
            <div>${content
              .split("\n\n")
              .map((p) => `<p>${p}</p>`)
              .join("")}</div>
            
            <p style="margin-top: 24px; text-align: right;">Saygılarımla,</p>

            <div class="footer-container">
              <div class="footer-left">
                ${signerPhone || signerAddress ? '<strong>İletişim:</strong><br/>' : ''}
                ${signerPhone ? `Tel: ${signerPhone}<br/>` : ""}
                ${signerAddress ? `Adres: ${signerAddress}` : ""}
              </div>
              <div class="footer-right">
                ${signerName ? `<p style="font-weight: bold; margin-bottom: 30px;">${signerName}</p>` : "<p style='margin-bottom: 30px;'>Adı-Soyadı</p>"}
                <p>İmza</p>
              </div>
            </div>

            <div class="watermark">
               Yaver Hukuk Asistanı ile oluşturulmuştur.
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar - Same as before */}
      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm">Önizleme Modu</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <span className="text-sm text-slate-400">
            Oluşturuldu: {getFormattedDate("full")}
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
      <div className="bg-white text-black rounded-lg shadow-2xl overflow-hidden mx-auto max-w-[21cm]">
        {/* Paper Effect - Updated to match print styles approximately */}
        <div className="p-[2cm] min-h-[29.7cm] relative flex flex-col"> 
          
          {/* Date Top Right */}
          <div className="text-right mb-6 font-serif text-[11pt]">
            {getFormattedDate("short")}
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-[12pt] font-bold uppercase text-black font-serif">
              {headerText}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-3 text-justify font-serif text-[11pt] leading-[1.4] flex-1">
            {content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
            <p className="mt-6 text-right font-serif text-[11pt]">Saygılarımla,</p>
          </div>

          {/* Footer Grid */}
          <div className="mt-12 flex justify-between items-start font-serif text-[11pt]">
             {/* Left: Contact */}
             <div className="text-left w-1/2 text-[10pt]">
                {(signerPhone || signerAddress) && (
                  <>
                    <p className="font-bold border-b border-black/20 pb-1 mb-1 inline-block">İletişim Bilgileri</p>
                    {signerAddress && <p className="leading-tight mb-1">{signerAddress}</p>}
                    {signerPhone && <p className="leading-tight">Tel: {signerPhone}</p>}
                  </>
                )}
             </div>

             {/* Right: Signature */}
             <div className="text-center w-1/3">
                {signerName ? (
                     <p className="font-bold mb-8">{signerName}</p>
                ) : (
                     <p className="font-bold mb-8">ADI SOYADI</p>
                )}
                <div className="border-t border-black/50 pt-1 w-2/3 mx-auto">
                    <p className="text-[10pt]">İmza</p>
                </div>
             </div>
          </div>
          
           {/* Watermark for screen only */}
           <div className="absolute bottom-4 left-0 w-full text-center text-[7pt] text-gray-300 select-none pointer-events-none">
             Yaver Hukuk Asistanı Önizleme
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
              Bu dilekçe AI tarafından oluşturulmuştur. {signerName ? `"${signerName}" olarak imzalanmaya hazırdır.` : ""} Resmi kurumlara
              göndermeden önce bir hukuk uzmanına danışmanız önerilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
