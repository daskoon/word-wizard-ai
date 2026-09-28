
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ZoomIn, Move, LayoutGrid, GripHorizontal } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  cropType: 'board' | 'rack';
  onConfirm: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, cropType, onConfirm, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isBoard = cropType === 'board';
  // Aspect ratio styles: Board is 1:1, Rack is approx 5:1 (wide)
  const aspectClass = isBoard ? 'aspect-square max-w-sm' : 'aspect-[5/1] max-w-lg';

  // Initialize: Center the image
  useEffect(() => {
    // Reset zoom/offset when image or type changes
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc, cropType]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    // e.preventDefault() prevents scrolling on touch devices which is good here
    if (e.cancelable) e.preventDefault(); 
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const performCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Output size: Large enough for OCR
    const OUTPUT_WIDTH = 1000;
    // Calculate height based on the container aspect ratio
    const OUTPUT_HEIGHT = isBoard ? 1000 : 200; 

    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    if (ctx) {
      // Calculate the portion of the image visible in the container
      const scaleFactor = imageRef.current.naturalWidth / imageRect.width;

      const relativeX = containerRect.left - imageRect.left;
      const relativeY = containerRect.top - imageRect.top;

      const sourceX = relativeX * scaleFactor;
      const sourceY = relativeY * scaleFactor;
      const sourceW = containerRect.width * scaleFactor;
      const sourceH = containerRect.height * scaleFactor;

      ctx.fillStyle = '#000000'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        imageRef.current,
        sourceX, sourceY, sourceW, sourceH, 
        0, 0, canvas.width, canvas.height
      );

      // Higher quality JPEG
      onConfirm(canvas.toDataURL('image/jpeg', 0.95));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="text-white font-black text-lg flex items-center gap-2">
              {isBoard ? <LayoutGrid size={20} className="text-indigo-400"/> : <GripHorizontal size={20} className="text-emerald-400"/>}
              {isBoard ? "Step 1: Crop Board" : "Step 2: Crop Rack"}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              {isBoard ? "Drag the box to fit the 11x11 grid perfectly." : "Drag the box to fit your 7 tiles."}
            </p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Viewport Area - Flexible height */}
        <div className="relative flex-1 bg-black overflow-hidden cursor-move touch-none flex items-center justify-center min-h-[300px]"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onTouchStart={handleMouseDown}
             onTouchMove={handleMouseMove}
             onTouchEnd={handleMouseUp}
        >
          {/* The visual "Window" (The Crop Area) */}
          <div ref={containerRef} className={`relative pointer-events-none z-10 border-2 ${isBoard ? 'border-indigo-500' : 'border-emerald-500'} shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] w-full ${aspectClass}`}>
            
            {/* Grid Overlay Guides */}
            {isBoard ? (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                 <div className="border-r border-indigo-500/50 h-full col-start-2"></div>
                 <div className="border-r border-indigo-500/50 h-full col-start-3"></div>
                 <div className="border-b border-indigo-500/50 w-full row-start-2 absolute top-0"></div>
                 <div className="border-b border-indigo-500/50 w-full row-start-3 absolute top-0"></div>
              </div>
            ) : (
              <div className="absolute inset-0 flex justify-evenly opacity-30">
                 {/* 6 vertical lines for 7 slots */}
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-full border-r border-emerald-500/50"></div>
                 ))}
              </div>
            )}

            {/* Corner Markers */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 ${isBoard ? 'border-indigo-500' : 'border-emerald-500'}`}></div>
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 ${isBoard ? 'border-indigo-500' : 'border-emerald-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 ${isBoard ? 'border-indigo-500' : 'border-emerald-500'}`}></div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 ${isBoard ? 'border-indigo-500' : 'border-emerald-500'}`}></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <img 
              ref={imageRef}
              src={imageSrc} 
              alt="Crop Target" 
              draggable={false}
              className="max-w-none origin-center transition-transform duration-75 ease-out select-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                // We base the image size on the width of the container parent to ensure it's large enough
                width: '100%' 
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-5">
           <div className="flex items-center gap-4 text-slate-400">
             <ZoomIn size={16} />
             <input 
               type="range" 
               min="0.2" 
               max="5" 
               step="0.05" 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
           </div>
           
           <button 
             onClick={performCrop} 
             className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
               isBoard 
                 ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' 
                 : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
             }`}
           >
             <Check size={20} /> 
             {isBoard ? "Confirm Board & Next" : "Confirm Rack & Analyze"}
           </button>
        </div>

      </div>
    </div>
  );
};

export default ImageCropper;
