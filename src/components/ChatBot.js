import React, { useState, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [entreprises, setEntreprises] = useState([]);
  const [investisseurs, setInvestisseurs] = useState([]);
  const [showChoices, setShowChoices] = useState(true);
  const [currentMode, setCurrentMode] = useState(null); // 'investisseur' ou 'entreprise'

  // Données de démonstration
  const demoData = {
    entreprises: [
      { nom: "TechStart", secteur: "Technologie" },
      { nom: "GreenEnergy", secteur: "Énergie" },
      { nom: "HealthCare", secteur: "Santé" }
    ],
    investisseurs: [
      { nom: "Investor1", secteur: "Technologie" },
      { nom: "Investor2", secteur: "Énergie" },
      { nom: "Investor3", secteur: "Santé" }
    ]
  };

  const questionsByMode = {
    investisseur: [
      "Combien y a-t-il d'entreprises inscrites ?",
      "Quelles sont les entreprises disponibles ?",
      "Quels sont les secteurs d'activité ?",
      "Comment puis-je investir ?",
    ],
    entreprise: [
      "Combien y a-t-il d'investisseurs ?",
      "Comment créer mon profil entreprise ?",
      "Comment contacter les investisseurs ?",
      "Quels sont les avantages de la plateforme ?",
    ]
  };

  // Charger les données depuis localStorage ou utiliser les données de démonstration
  useEffect(() => {
    const loadData = () => {
      try {
        // Récupérer les données depuis localStorage
        const storedEntreprises = JSON.parse(localStorage.getItem('entreprises')) || demoData.entreprises;
        const storedInvestisseurs = JSON.parse(localStorage.getItem('investisseurs')) || demoData.investisseurs;

        setEntreprises(storedEntreprises);
        setInvestisseurs(storedInvestisseurs);

        // Sauvegarder les données de démonstration si localStorage est vide
        if (!localStorage.getItem('entreprises')) {
          localStorage.setItem('entreprises', JSON.stringify(demoData.entreprises));
        }
        if (!localStorage.getItem('investisseurs')) {
          localStorage.setItem('investisseurs', JSON.stringify(demoData.investisseurs));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // En cas d'erreur, utiliser les données de démonstration
        setEntreprises(demoData.entreprises);
        setInvestisseurs(demoData.investisseurs);
      }
    };

    loadData();
  }, []);

  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
    setShowChoices(false);
    
    // Ajouter un message de confirmation du mode
    const message = mode === 'investisseur' 
      ? "Vous cherchez à investir. Voici les questions fréquentes :"
      : "Vous cherchez des investisseurs. Voici les questions fréquentes :";
    
    setMessages(prev => [...prev, {
      text: message,
      sender: 'bot',
      id: Date.now()
    }]);
  };

  const handleQuestionClick = (question) => {
    // Ajouter la question comme message utilisateur
    setMessages(prev => [...prev, {
      text: question,
      sender: 'user',
      id: Date.now()
    }]);

    // Générer et ajouter la réponse
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: generateResponse(question),
        sender: 'bot',
        id: Date.now() + 1
      }]);
    }, 500);
  };

  // Fonction pour générer des réponses basiques
  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Questions sur le nombre d'entreprises
    if (lowerMessage.includes('combien') && lowerMessage.includes('entreprise')) {
      return `Il y a actuellement ${entreprises.length} entreprise${entreprises.length > 1 ? 's' : ''} inscrite${entreprises.length > 1 ? 's' : ''} sur la plateforme.`;
    }

    // Questions sur la liste des entreprises
    if ((lowerMessage.includes('liste') || lowerMessage.includes('disponible')) && lowerMessage.includes('entreprise')) {
      if (entreprises.length === 0) {
        return "Il n'y a pas encore d'entreprises inscrites sur la plateforme.";
      }
      const entreprisesList = entreprises.map(e => e.nom).join(', ');
      return `Voici la liste des entreprises inscrites : ${entreprisesList}`;
    }

    // Questions sur les secteurs d'activité
    if (lowerMessage.includes('secteur')) {
      const secteurs = [...new Set(entreprises.map(e => e.secteur))];
      return `Les secteurs d'activité présents sont : ${secteurs.join(', ')}`;
    }

    // Questions sur le nombre d'investisseurs
    if (lowerMessage.includes('combien') && lowerMessage.includes('investisseur')) {
      return `Il y a actuellement ${investisseurs.length} investisseur${investisseurs.length > 1 ? 's' : ''} inscrit${investisseurs.length > 1 ? 's' : ''} sur la plateforme.`;
    }

    // Questions sur la création de profil
    if (lowerMessage.includes('créer') && lowerMessage.includes('profil')) {
      return "Pour créer votre profil entreprise, cliquez sur 'Inscription' en haut de la page, puis sélectionnez 'Je suis une Entreprise'. Vous pourrez ensuite remplir vos informations et présenter votre projet.";
    }

    // Questions sur comment investir
    if (lowerMessage.includes('comment') && lowerMessage.includes('investir')) {
      return "Pour investir, créez d'abord votre profil investisseur. Vous pourrez ensuite parcourir la liste des entreprises, consulter leurs projets et les contacter directement via la plateforme.";
    }

    // Questions sur les avantages
    if (lowerMessage.includes('avantage')) {
      return "Notre plateforme offre plusieurs avantages : mise en relation directe avec les investisseurs, visibilité accrue de votre projet, processus simplifié de levée de fonds, et un accompagnement personnalisé.";
    }

    // Questions sur comment contacter
    if (lowerMessage.includes('comment') && lowerMessage.includes('contacter')) {
      return "Une fois inscrit, vous pouvez contacter directement les investisseurs via leur profil. Vous y trouverez leurs coordonnées et pourrez leur envoyer des messages via la plateforme.";
    }

    // Réponses par défaut
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
      return "Bonjour! Comment puis-je vous aider aujourd'hui?";
    }

    if (lowerMessage.includes('merci')) {
      return "Je vous en prie! N'hésitez pas si vous avez d'autres questions.";
    }

    return "Je ne suis pas sûr de comprendre. Vous pouvez sélectionner une des questions proposées ou me poser une autre question.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      id: Date.now()
    };

    // Générer la réponse du bot
    const botMessage = {
      text: generateResponse(inputMessage),
      sender: 'bot',
      id: Date.now() + 1
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputMessage('');
  };

  return (
    <div className="chatbot-container">
      <button 
        className="chatbot-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setShowChoices(true);
            setCurrentMode(null);
            setMessages([]);
          }
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Assistant virtuel</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="message bot">
                <p>Bienvenue sur Fundyy ! 👋</p>
                <p>La plateforme qui connecte les entreprises innovantes aux investisseurs potentiels.</p>
                <p>Comment puis-je vous aider aujourd'hui ?</p>
              </div>
            )}
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {showChoices && (
            <div className="chatbot-choices">
              <button 
                className="choice-button investor"
                onClick={() => handleModeSelect('investisseur')}
              >
                Je cherche à investir
              </button>
              <button 
                className="choice-button company"
                onClick={() => handleModeSelect('entreprise')}
              >
                Je cherche des investisseurs
              </button>
            </div>
          )}

          {currentMode && (
            <div className="chatbot-questions">
              {questionsByMode[currentMode].map((question, index) => (
                <button 
                  key={index}
                  className="question-button"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ou posez votre question ici..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send">
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 