import React from 'react';
import './FloatingWords.css';

const FloatingWords = () => {
  const words = [
    { text: 'Investissement', delay: 0 },
    { text: 'Innovation', delay: 2 },
    { text: 'Startup', delay: 4 },
    { text: 'Financement', delay: 1 },
    { text: 'Croissance', delay: 3 },
    { text: 'Partenariat', delay: 5 },
    { text: 'Développement', delay: 2.5 },
    { text: 'Opportunités', delay: 1.5 },
    { text: 'Entreprise', delay: 3.5 },
    { text: 'Réussite', delay: 4.5 },
    { text: 'Business', delay: 0.5 },
    { text: 'Projet', delay: 2.8 },
    { text: 'Capital', delay: 3.2 },
    { text: 'Succès', delay: 1.8 },
    { text: 'Expansion', delay: 4.2 }
  ];

  return (
    <div className="floating-words">
      {words.map((word, index) => (
        <div
          key={index}
          className="floating-word"
          style={{
            animationDelay: `${word.delay}s`,
            left: `${Math.random() * 80}%`,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
            fontSize: `${Math.random() * 8 + 20}px`
          }}
        >
          {word.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingWords; 