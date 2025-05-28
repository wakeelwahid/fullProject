import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faCoins,
  faGem,
  faDice,
  faTrophy,
  faCalendarAlt,
  faLock,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import "./Boxes.css";
import { Link } from "react-router-dom";

const Satta = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const createBgParticles = () => {
        const container = document.getElementById("bgAnimation");
        if (!container) return;

        const particleCount = window.innerWidth < 768 ? 10 : 20;

        container.innerHTML = ""; // Clear existing particles

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.classList.add("bg-particle");

          const size = Math.random() * 8 + 3;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 20 + 15;
          const opacity = Math.random() * 0.1 + 0.05;

          Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity,
          });

          container.appendChild(particle);
        }
      };

      const createCoins = () => {
        const container = document.getElementById("floatingCoins");
        if (!container) return;

        container.innerHTML = ""; // Clear existing coins

        const coinCount = window.innerWidth < 768 ? 4 : 8;
        const coins = ["\uf155", "\uf51e", "\uf51d", "\uf0d6", "\uf3ff"];

        for (let i = 0; i < coinCount; i++) {
          const coin = document.createElement("i");
          coin.className = "coin fas";
          coin.innerHTML = coins[Math.floor(Math.random() * coins.length)];

          const size = Math.random() * 20 + 15;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 20 + 10;

          Object.assign(coin.style, {
            fontSize: `${size}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          });

          container.appendChild(coin);
        }
      };

      // Initialize animations
      createBgParticles();
      createCoins();

      // Animate boxes with GSAP
      const boxes = document.querySelectorAll(".satta-box");

      gsap.to(boxes, {
        y: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "elastic.out(1, 0.5)",
        onComplete: () => setIsLoading(false),
      });

      // Handle resize
      const handleResize = () => {
        createBgParticles();
        createCoins();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    } catch (error) {
      console.error("Animation setup failed:", error);
      setIsLoading(false);
    }
  }, []);

  const games = [
    {
      id: 1,
      title: "JAIPUR KING",
      icon: faCrown,

      locked: false,
    },
    {
      id: 2,
      title: "FARIDABAD",
      icon: faGem,

      locked: false,
    },
    {
      id: 3,
      title: "GHAZIABAD",
      icon: faCoins,

      locked: false,
    },
    {
      id: 4,
      title: "GALI",
      icon: faGem,

      locked: false,
    },
    {
      id: 5,
      title: "DISAWER",
      icon: faCrown,

      locked: false,
    },
    {
      id: 6,
      title: "DIAMOND KING",
      icon: faTrophy,
       number: "789-012",
      locked: false,
    },
  ];

  return (
    <div className="satta-main-container">
      <div className="bg-animation" id="bgAnimation" />
      <div className="floating-coins" id="floatingCoins" />

      <div className="satta-container">
        <div className="satta-row">
          {games.map((game) => (
            <div key={game.id} className="satta-box-wrapper">
              <div className={`satta-box ${game.locked ? "locked" : ""}`}>
                <div className="satta-content">
                  <div className="satta-icon-wrapper">
                    <div className="satta-icon">
                      <FontAwesomeIcon
                        icon={game.locked ? faLock : game.icon}
                        className="icon-pulse"
                      />
                    </div>
                  </div>
                  <h4 className="satta-title">{game.title}</h4>
                  <div className="satta-number-wrapper">
                    <div className="satta-number">{game.number}</div>
                    <div className="number-glow"></div>
                  </div>
                  {
                    <Link
                      to="/numbers"
                      state={{ game: game.title.toLowerCase() }}
                      className="satta-btn"
                    >
                      <span className="btn-text">PLAY NOW</span>
                      <div className="btn-glow"></div>
                    </Link>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Satta;
