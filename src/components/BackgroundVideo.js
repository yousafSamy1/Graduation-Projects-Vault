'use client';

export default function BackgroundVideo() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.45,
          filter: 'brightness(1.02) contrast(1.05)'
        }}
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      
      {/* Light Overlay keeping background video visible across the entire page layout */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(248, 250, 252, 0.7) 100%)'
        }} 
      />
    </div>
  );
}
