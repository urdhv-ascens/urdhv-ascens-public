'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Copy, 
  ExternalLink, 
  Check, 
  Loader2, 
  Trash2,
  FileCode,
  Sparkles,
  RefreshCw,
  Server
} from 'lucide-react';
import { uploadAsset, getMediaAssets, deleteMediaAsset, type MediaAssetItem } from '@/lib/api-client';

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingFilename, setDeletingFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch live media assets from Hostinger backend
  const fetchLiveAssets = useCallback(async () => {
    setIsLoading(true);
    setUploadError(null);
    try {
      const serverAssets = await getMediaAssets();
      if (serverAssets && serverAssets.length > 0) {
        setAssets(serverAssets);
        try {
          localStorage.setItem('urdhv_media_assets', JSON.stringify(serverAssets));
        } catch (_) {}
      } else {
        // Fallback to local storage if server returned empty
        const saved = localStorage.getItem('urdhv_media_assets');
        if (saved) {
          setAssets(JSON.parse(saved));
        }
      }
    } catch (err: any) {
      console.warn('Failed to load server assets:', err);
      const saved = localStorage.getItem('urdhv_media_assets');
      if (saved) {
        setAssets(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAssets();
  }, [fetchLiveAssets]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadAsset(file);
        if (res.success && res.url) {
          successCount++;
        } else {
          setUploadError(res.message || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        setUploadError(err?.message || `Network error uploading ${file.name}`);
      }
    }

    if (successCount > 0) {
      setSuccessMessage(`Successfully uploaded ${successCount} media asset${successCount > 1 ? 's' : ''} to Hostinger storage.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      await fetchLiveAssets();
    }
    setIsUploading(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const removeAsset = async (asset: MediaAssetItem) => {
    if (!confirm(`Permanently delete "${asset.filename}" from the Hostinger server?`)) {
      return;
    }
    setDeletingFilename(asset.filename);
    try {
      const res = await deleteMediaAsset(asset.filename);
      if (res.success) {
        setAssets(prev => prev.filter(a => a.filename !== asset.filename && a.url !== asset.url));
        try {
          const updated = assets.filter(a => a.filename !== asset.filename && a.url !== asset.url);
          localStorage.setItem('urdhv_media_assets', JSON.stringify(updated));
        } catch (_) {}
      } else {
        alert(res.message || 'Failed to delete asset from server.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error communicating with server.');
    } finally {
      setDeletingFilename(null);
    }
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              HOSTINGER DIRECT CLOUD STORAGE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              /public_html/uploads
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">Media Library</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Upload images and high-resolution videos directly to Hostinger. Generates universal CDN URLs for CMS and website use.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLiveAssets()}
            disabled={isLoading}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2.5 rounded-lg text-xs font-mono hover:border-zinc-700 transition-colors disabled:opacity-50"
            title="Refresh media list from Hostinger"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-emerald-400" : ""} />
            <span>Sync</span>
          </button>

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
            className="flex items-center gap-2 bg-emerald-400 text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/10"
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

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          <span>{successMessage}</span>
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
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Server Media Assets ({assets.length})
            </h3>
            {isLoading && (
              <Loader2 size={12} className="animate-spin text-emerald-400" />
            )}
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="p-12 text-center bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-500 text-xs font-mono flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-zinc-700 mb-1" />
            <span>{isLoading ? "Fetching media from Hostinger..." : "No media uploaded yet. Upload files above to store them directly on Hostinger."}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {assets.map((asset, idx) => {
              const isDeleting = deletingFilename === asset.filename;
              return (
                <div 
                  key={asset.filename || idx} 
                  className={`group flex flex-col bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors ${
                    isDeleting ? 'opacity-40 pointer-events-none' : ''
                  }`}
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
                      {asset.size ? (
                        <span className="text-[10px] font-mono text-zinc-500">
                          {formatFileSize(asset.size)}
                        </span>
                      ) : null}
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
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink size={12} />
                      </a>

                      <button
                        onClick={() => removeAsset(asset)}
                        disabled={isDeleting}
                        className="p-1.5 bg-zinc-900 hover:bg-red-500/20 hover:text-red-400 text-zinc-500 rounded transition-colors"
                        title="Delete from server"
                      >
                        {isDeleting ? <Loader2 size={12} className="animate-spin text-red-400" /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
