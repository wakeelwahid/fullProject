import React from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaClock, FaHeadset, FaShieldAlt } from "react-icons/fa";
import "./Top_section.css";
import { Link } from "react-router-dom";

const TopSection = () => {
  return (
    <>
     
      <div className="top-section-container">
        {/* Announcement Marquee */}
        <div className="announcement-marquee">
          <marquee behavior="scroll" direction="left" scrollamount="5">
            <span className="marquee-item bonus">🎉 रेफर और 5000 बोनस पाएं! कोड: WELCOME500</span>
            <span className="marquee-item jackpot">💰 आज का जैकपॉट: ₹25,00,000</span>
            <span className="marquee-item new-game">🔥 नया गेम लॉन्च: डायमंड किंग</span>
            <span className="marquee-item special">⭐ विशेष ऑफर: पहले डिपॉजिट पर 100% बोनस</span>
            <span className="marquee-item new-game">🔥 नया गेम लॉन्च: डायमंड किंग</span>
            <span className="marquee-item special">⭐ विशेष ऑफर: पहले डिपॉजिट पर 100% बोनस</span>
          </marquee>
        </div>

        {/* Animated background particles */}
        <div className="top-section-particles">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: ["0%", "100%"],
                x: Math.random() > 0.5 ? ["0%", "10%"] : ["0%", "-10%"],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 3}px`,
                height: `${Math.random() * 5 + 3}px`,
                background: `rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1})`,
              }}
            />
          ))}
        </div>

        <div className="top-section-content">
          <motion.div
            className="top-section-title"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p>भारत का नंबर 1 गेमिंग प्लेटफॉर्म</p>
          </motion.div>

          <div className="features-grid">
            {/* Feature 1 */}
            <motion.div
              className="feature-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">
                <FaRupeeSign />
              </div>
              <h3>24x7 निकासी</h3>
              <p>किसी भी समय पैसा निकालें</p>
              <div className="feature-glow"></div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="feature-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>5 मिनट में भुगतान</h3>
              <p>सुपर फास्ट पेमेंट प्रोसेस</p>
              <div className="feature-glow"></div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="feature-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>24x7 सपोर्ट</h3>
              <p>हमेशा आपकी सेवा में</p>
              <div className="feature-glow"></div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="feature-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>100% सुरक्षित</h3>
              <p>सुरक्षित और विश्वसनीय</p>
              <div className="feature-glow"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopSection;
