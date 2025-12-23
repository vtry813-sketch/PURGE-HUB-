import React, { useEffect, useState } from "react";

function Videoplayer({ media, mute, videoref }) {
  const [playing, setplaying] = useState(true);

  const handleclick = () => {
    if (!videoref.current) return;

    if (playing) {
      videoref.current.pause();
      setplaying(false);
    } else {
      videoref.current.play().catch(() => {});
      setplaying(true);
    }
  };
  useEffect(() => {
    if (videoref.current) {
      videoref.current.pause();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoref.current) return; // ⭐ prevents null errors

        if (entry.isIntersecting) {
          videoref.current.play().catch(() => {});
        } else {
          videoref.current.pause();
        }
      },
      { threshold: 1 }
    );

    const currentVideo = videoref.current;

    if (currentVideo) observer.observe(currentVideo);

    return () => {
      if (currentVideo) observer.unobserve(currentVideo);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-[225px] md:w-[250px] h-[450px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer">
      <video
        ref={videoref}
        src={media}
        autoPlay
        loop
        muted={mute}
        onClick={handleclick}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Videoplayer;
