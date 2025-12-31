import React from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface AnimatedBackgroundProps {
  scrollProgress: number;
  mousePosition: MousePosition;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  scrollProgress,
  mousePosition,
}) => {
  return (
    <>
      {/* Animated Background with Particles */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translateY(${scrollProgress * 0.5}px)`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div
        className="floating-element floating-1"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${
            mousePosition.y * 0.1
          }px)`,
        }}
      >
        🏥
      </div>
      <div
        className="floating-element floating-2"
        style={{
          transform: `translate(${-mousePosition.x * 0.05}px, ${
            -mousePosition.y * 0.05
          }px)`,
        }}
      >
        💊
      </div>
      <div
        className="floating-element floating-3"
        style={{
          transform: `translate(${mousePosition.x * 0.08}px, ${
            mousePosition.y * -0.08
          }px)`,
        }}
      >
        📊
      </div>

      {/* Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />
    </>
  );
};

export default AnimatedBackground;
