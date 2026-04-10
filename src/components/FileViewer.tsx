import React from 'react';
import { X, Download, FileText, File as FileIcon, Image as ImageIcon, Eye } from 'lucide-react';
import { FileAsset } from '../types';

interface FileViewerProps {
  file: FileAsset;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  const isHtml = file.type === 'text/html';

  const renderContent = () => {
    if (isImage) {
      return (
        <img 
          src={file.data} 
          alt={file.name} 
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      );
    }

    if (isPdf) {
      return (
        <iframe 
          src={file.data} 
          className="w-full h-[70vh] rounded-lg border-none"
          title={file.name}
        />
      );
    }

    if (isHtml) {
      return (
        <iframe 
          srcDoc={atob(file.data.split(',')[1])} 
          className="w-full h-[70vh] rounded-lg border-none bg-white"
          title={file.name}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileIcon className="w-20 h-20 text-text-dim" />
        <p className="text-text-secondary">Visualização não disponível para este tipo de arquivo.</p>
        <a 
          href={file.data} 
          download={file.name}
          className="px-6 py-2 bg-secondary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4" />
          Baixar Arquivo
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              {isImage ? <ImageIcon className="w-5 h-5 text-secondary" /> : <FileText className="w-5 h-5 text-secondary" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">{file.name}</h3>
              <p className="text-[10px] text-text-dim uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB · {file.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={file.data} 
              download={file.name}
              className="p-2 text-text-dim hover:text-white transition-colors"
              title="Baixar"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-text-dim hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto bg-bg-base/50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
