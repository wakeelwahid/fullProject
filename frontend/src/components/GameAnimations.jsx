import React from 'react';
import './GameAnimations.css';

const GameAnimations = () => {
  return (
    <div className="video-background">
      <video autoPlay muted loop className="background-video">
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default GameAnimations;