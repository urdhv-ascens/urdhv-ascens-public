'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Copy, 
  ExternalLink, 
  Check, 
  Loader2, 
  Trash2,
  FileCode,
  Sparkles
} from 'lucide-react';
import { uploadAsset } from '@/lib/api-client';

interface MediaAsset {
  url: string;
  filename: string;
  size?: number;
  type?: 'image' | 'video';
  uploadedAt: string;
}

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted assets history
  useEffect(() => {
    try {
      const saved = localStorage.getItem('urdhv_media_assets');
      if (saved) {
        setAssets(JSON.parse(saved));
      } else {
        // Initial defaults showcasing existing local assets
        const initial: MediaAsset[] = [
          {
            url: '/assets/images/favicon.png',
            filename: 'favicon.png',
            type: 'image',
            uploadedAt: new Date().toISOString()
          },
          {
            url: '/logo.png',
            filename: 'logo.png',
            type: 'image',
            uploadedAt: new Date().toISOString()
          }
        ];
        setAssets(initial);
      }
    } catch (e) {
      console.warn('Failed to load media history:', e);
    }
  }, []);

  const saveAssets = (list: MediaAsset[]) => {
    setAssets(list);
    try {
      localStorage.setItem('urdhv_media_assets', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist media history:', e);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const uploadedList: MediaAsset[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadAsset(file);
        if (res.success && res.url) {
          const isVideo = file.type.startsWith('video/');
          uploadedList.push({
            url: res.url,
            filename: file.name,
            size: file.size,
            type: isVideo ? 'video' : 'image',
            uploadedAt: new Date().toISOString()
          });
        } else {
          setUploadError(res.message || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        setUploadError(err?.message || `Network error uploading ${file.name}`);
      }
    }

    if (uploadedList.length > 0) {
      saveAssets([...uploadedList, ...assets]);
    }
    setIsUploading(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const removeAsset = (url: string) => {
    const filtered = assets.filter(a => a.url !== url);
    saveAssets(filtered);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-1 block">
            HOSTINGER DIRECT STORAGE
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white">Media Library</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Upload images and videos directly to Hostinger's /uploads directory. Zero external dependencies.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => handleFiles(e.target.files)}
            multiple
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="flex items-center gap-2 bg-emerald-400 text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            <span>{isUploading ? "Uploading..." : "Upload Media"}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-mono text-red-400">
          {uploadError}
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragOver 
            ? 'border-emerald-400 bg-emerald-500/5' 
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
        }`}
      >
        <div className="p-3 bg-zinc-900 rounded-full mb-3 text-emerald-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white">
          Click or drag & drop files here to upload
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Supports JPG, PNG, WebP, GIF, and MP4/WebM videos (up to 100MB).
        </p>
      </div>

      {/* Assets Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Uploaded Media ({assets.length})
          </h3>
          {assets.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear local media library list? (Files remain safely on server)")) {
                  saveAssets([]);
                }
              }}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-400"
            >
              Clear List
            </button>
          )}
        </div>

        {assets.length === 0 ? (
          <div className="p-12 text-center bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-500 text-xs font-mono">
            No media uploaded yet. Drag and drop files above to generate live asset URLs.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {assets.map((asset, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Media Preview Thumbnail */}
                <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden border-b border-zinc-850">
                  {asset.type === 'video' || asset.url.endsWith('.mp4') || asset.url.endsWith('.webm') ? (
                    <video 
                      src={asset.url} 
                      className="w-full h-full object-cover"
                      muted 
                      loop 
                      autoPlay 
                      playsInline
                    />
                  ) : (
                    <img 
                      src={asset.url} 
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback icon on broken image
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono rounded border border-zinc-800 uppercase">
                    {asset.type || 'img'}
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white truncate" title={asset.filename}>
                      {asset.filename}
                    </span>
                    {asset.size && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        {formatFileSize(asset.size)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => copyToClipboard(asset.url)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-300 transition-colors rounded text-xs font-mono"
                    >
                      {copiedUrl === asset.url ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <a 
                      href={asset.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink size={12} />
                    </a>

                    <button
                      onClick={() => removeAsset(asset.url)}
                      className="p-1.5 bg-zinc-900 hover:bg-red-500/20 hover:text-red-400 text-zinc-500 rounded transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
