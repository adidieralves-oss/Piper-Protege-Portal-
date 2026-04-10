import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FileAsset } from '../types';

interface BulkUploadProps {
  onUpload: (files: FileAsset[]) => void;
  onClose: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onUpload, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    const assets: FileAsset[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      assets.push({
        id: 'f' + Date.now() + i,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: base64,
        uploadedAt: new Date().toISOString()
      });
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    onUpload(assets);
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-subtle">
          <h3 className="text-sm font-bold text-white">Importação em Massa</h3>
          <button onClick={onClose} className="p-2 text-text-dim hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-subtle rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-secondary/10 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Clique ou arraste arquivos aqui</p>
              <p className="text-xs text-text-dim">PDF, HTML, XLSX, DOC, Imagens, etc.</p>
            </div>
            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-subtle border border-border-subtle rounded-xl group">
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-4 h-4 text-text-dim" />
                    <div className="max-w-[200px] sm:max-w-[300px]">
                      <p className="text-xs font-bold text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-text-dim uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(i)} className="p-1 text-text-dim hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-text-dim uppercase tracking-widest">
                <span>Processando arquivos...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={processFiles}
              disabled={files.length === 0 || isUploading}
              className="flex-1 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isUploading ? 'Importando...' : `Importar ${files.length} arquivos`}
            </button>
            <button 
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-3 bg-surface-subtle text-text-dim font-bold rounded-xl hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
