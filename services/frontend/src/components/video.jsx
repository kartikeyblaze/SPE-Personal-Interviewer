import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import "./video.css";

export const Video = forwardRef((props, ref) => {
  const [recordings, setRecordings] = useState([]);
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({ video: true, audio: true });
  const previewVideoRef = useRef(null);

  useEffect(() => {
    if (previewVideoRef.current && previewStream) {
      previewVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          downloadVideo(blob);
          const updatedRecordings = [...recordings, mediaBlobUrl];
          setRecordings(updatedRecordings);
        })
        .catch((error) => console.error("Error fetching video blob:", error));
    }
  }, [mediaBlobUrl]);

  const downloadVideo = (blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `recording_${new Date().toISOString()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearRecording = () => {
    clearBlobUrl();
    setRecordings([]);
  };

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    handleClearRecording,
  }));

  return (
    <div className="relative w-full h-full bg-scholar-brown/20 flex items-center justify-center overflow-hidden">
      <video
        ref={previewVideoRef}
        autoPlay
        muted
        className="w-full h-full object-cover grayscale-[30%] sepia-[20%] brightness-[90%]"
      />
      {/* Decorative Corner Overlays */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-scholar-cream/30 m-2" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-scholar-cream/30 m-2" />
      
      {status === 'recording' && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-scholar-terracotta/80 text-scholar-cream text-[8px] uppercase tracking-widest rounded-full animate-pulse">
          <div className="w-1.5 h-1.5 bg-scholar-cream rounded-full" /> Live Manuscript Capture
        </div>
      )}
    </div>
  );
});
