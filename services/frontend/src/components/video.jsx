import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import "./video.css";

export const Video = forwardRef((props, ref) => {
  const { isActive = false } = props;
  const [cameraError, setCameraError] = useState("");
  const {
    status,
    startRecording,
    stopRecording,
    previewStream,
    clearBlobUrl,
    error,
  } = useReactMediaRecorder({ video: true, audio: false });
  const previewVideoRef = useRef(null);

  useEffect(() => {
    if (previewVideoRef.current && previewStream) {
      previewVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    const canStart = status === "idle" || status === "stopped";

    if (isActive && canStart) {
      startRecording();
    }

    if (!isActive && status === "recording") {
      stopRecording();
    }
  }, [isActive, status, startRecording, stopRecording]);

  useEffect(() => {
    setCameraError(error ? "Camera access is unavailable. Please allow camera permissions." : "");
  }, [error]);

  const handleClearRecording = () => {
    clearBlobUrl();
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
        playsInline
        muted
        className="w-full h-full object-cover grayscale-[30%] sepia-[20%] brightness-[90%]"
      />
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-scholar-brown/90 px-6 text-center text-xs uppercase tracking-widest text-scholar-cream">
          {cameraError}
        </div>
      )}
      {!cameraError && !previewStream && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs uppercase tracking-widest text-scholar-cream/70">
          Camera feed will appear when the interview starts
        </div>
      )}
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
