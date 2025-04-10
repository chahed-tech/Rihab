import React, { useState, useEffect } from 'react';
import './App.css';
import EntrepriseForm from './components/EntrepriseForm';
import InvestisseurForm from './components/InvestisseurForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import logo from './assets/images/Fundyy.png';
import database from './data/database.json';

// Constantes pour la gestion des images
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB par image
const MAX_TOTAL_STORAGE = 5 * 1024 * 1024; // 5MB total
const MAX_ENTREPRISES = 100;
const MAX_INVESTISSEURS = 100;

// Composant pour afficher une entreprise
const EntrepriseCard = ({ entreprise }) => (
  <div className="card">
    {entreprise.image && (
      <div className="card-image-container">
        <img 
          src={entreprise.image} 
          alt={entreprise.nom}
          className="card-image"
        />
      </div>
    )}
    <div className="card-content">
      <h3>{entreprise.nom}</h3>
      <p><strong>Secteur:</strong> {entreprise.secteur}</p>
      <p><strong>Description:</strong> {entreprise.description}</p>
      <p><strong>Montant recherché:</strong> {entreprise.montantRecherche} €</p>
      <div className="contact-links">
        <a href={`mailto:${entreprise.email}`} className="contact-link">
          <i className="fas fa-envelope"></i>
          <span>{entreprise.email}</span>
        </a>
      </div>
      <div className="social-links">
        {entreprise.whatsapp && (
          <a href={`https://wa.me/${entreprise.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
        )}
        {entreprise.facebook && (
          <a href={entreprise.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
        )}
        {entreprise.instagram && (
          <a href={entreprise.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        )}
      </div>
    </div>
  </div>
);

// Composant pour afficher un investisseur
const InvestisseurCard = ({ investisseur }) => (
  <div className="card">
    {investisseur.image && (
      <div className="card-image-container">
        <img 
          src={investisseur.image} 
          alt={`${investisseur.prenom} ${investisseur.nom}`}
          className="card-image"
        />
      </div>
    )}
    <div className="card-content">
      <h3>{investisseur.nom} {investisseur.prenom}</h3>
      <p><strong>Type:</strong> {investisseur.typeInvestisseur}</p>
      <p><strong>Montant d'investissement:</strong> {investisseur.montantMin}€ - {investisseur.montantMax}€</p>
      <p><strong>Secteurs d'intérêt:</strong> {investisseur.secteursInteret}</p>
      <div className="contact-links">
        <a href={`mailto:${investisseur.email}`} className="contact-link">
          <i className="fas fa-envelope"></i>
          <span>{investisseur.email}</span>
        </a>
      </div>
      <div className="social-links">
        {investisseur.whatsapp && (
          <a href={`https://wa.me/${investisseur.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
        )}
        {investisseur.facebook && (
          <a href={investisseur.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
        )}
        {investisseur.instagram && (
          <a href={investisseur.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        )}
      </div>
    </div>
  </div>
);

function App() {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [storageUsed, setStorageUsed] = useState(0);
  const [error, setError] = useState('');
  
  // Charger les données depuis localStorage au démarrage
  const [entreprises, setEntreprises] = useState(() => {
    const savedEntreprises = localStorage.getItem('entreprises');
    return savedEntreprises ? JSON.parse(savedEntreprises) : database.entreprises;
  });

  const [investisseurs, setInvestisseurs] = useState(() => {
    const savedInvestisseurs = localStorage.getItem('investisseurs');
    return savedInvestisseurs ? JSON.parse(savedInvestisseurs) : database.investisseurs;
  });

  // Calculer l'espace de stockage utilisé
  useEffect(() => {
    const calculateStorage = () => {
      let total = 0;
      
      // Calculer la taille des données JSON
      total += JSON.stringify(entreprises).length;
      total += JSON.stringify(investisseurs).length;
      
      // Ajouter la taille des images
      [...entreprises, ...investisseurs].forEach(user => {
        if (user.image) {
          total += user.image.length;
        }
      });
      
      setStorageUsed(total);
    };
    
    calculateStorage();
  }, [entreprises, investisseurs]);

  // Sauvegarder les données dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('entreprises', JSON.stringify(entreprises));
  }, [entreprises]);

  useEffect(() => {
    localStorage.setItem('investisseurs', JSON.stringify(investisseurs));
  }, [investisseurs]);

  // Fonction pour convertir une image en base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error('L\'image est trop grande. Taille maximale: 2MB'));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogin = (loginData) => {
    const user = [...entreprises, ...investisseurs].find(
      u => u.email === loginData.email && u.password === loginData.password
    );
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setView('profile');
    } else {
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('home');
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Vérifier si une nouvelle image est ajoutée
      if (updatedData.imageFile) {
        const imageBase64 = await convertImageToBase64(updatedData.imageFile);
        updatedData.image = imageBase64;
        delete updatedData.imageFile;
      }

      if (currentUser.type === 'entreprise') {
        setEntreprises(prev => 
          prev.map(entreprise => 
            entreprise.id === currentUser.id ? { ...entreprise, ...updatedData } : entreprise
          )
        );
      } else {
        setInvestisseurs(prev => 
          prev.map(investisseur => 
            investisseur.id === currentUser.id ? { ...investisseur, ...updatedData } : investisseur
          )
        );
      }
      setCurrentUser(updatedData);
      setView('profile');
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert(error.message || 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  const handleEntrepriseSubmit = async (formData) => {
    try {
      // Vérifier les limites
      if (entreprises.length >= MAX_ENTREPRISES) {
        alert('Nombre maximum d\'entreprises atteint');
        return;
      }

      if (storageUsed >= MAX_TOTAL_STORAGE) {
        alert('Espace de stockage insuffisant');
        return;
      }

      const emailExists = [...entreprises, ...investisseurs].some(
        user => user.email === formData.email
      );

      if (emailExists) {
        alert('Cet email est déjà utilisé. Veuillez utiliser un autre email.');
        return;
      }

      // Convertir l'image si elle existe
      let imageBase64 = null;
      if (formData.imageFile) {
        imageBase64 = await convertImageToBase64(formData.imageFile);
      }

      const newEntreprise = {
        ...formData,
        id: Date.now(),
        type: 'entreprise',
        dateInscription: new Date().toISOString(),
        statut: 'actif',
        image: imageBase64
      };

      delete newEntreprise.imageFile;

      setEntreprises(prev => [...prev, newEntreprise]);
      setCurrentUser(newEntreprise);
      setIsLoggedIn(true);
      setView('profile');
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
      alert(error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleInvestisseurSubmit = async (formData) => {
    try {
      // Vérifier les limites
      if (investisseurs.length >= MAX_INVESTISSEURS) {
        alert('Nombre maximum d\'investisseurs atteint');
        return;
      }

      if (storageUsed >= MAX_TOTAL_STORAGE) {
        alert('Espace de stockage insuffisant');
        return;
      }

      const emailExists = [...entreprises, ...investisseurs].some(
        user => user.email === formData.email
      );

      if (emailExists) {
        alert('Cet email est déjà utilisé. Veuillez utiliser un autre email.');
        return;
      }

      // Convertir l'image si elle existe
      let imageBase64 = null;
      if (formData.imageFile) {
        imageBase64 = await convertImageToBase64(formData.imageFile);
      }

      const newInvestisseur = {
        ...formData,
        id: Date.now(),
        type: 'investisseur',
        dateInscription: new Date().toISOString(),
        statut: 'actif',
        image: imageBase64
      };

      delete newInvestisseur.imageFile;

      setInvestisseurs(prev => [...prev, newInvestisseur]);
      setCurrentUser(newInvestisseur);
      setIsLoggedIn(true);
      setView('profile');
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'investisseur:', error);
      alert(error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="home-content">
            <img src={logo} alt="Fundyy Logo Spinning" className="home-logo" />
          </div>
        );
      case 'login':
        return (
          <div className="login-overlay">
            <LoginForm onLogin={handleLogin} />
            <button className="close-button" onClick={() => setView('home')}>
              Fermer
            </button>
          </div>
        );
      case 'entreprises':
        return (
          <section className="list-section">
            <h2>Liste des Entreprises</h2>
            <div className="cards-container">
              {entreprises.map(entreprise => (
                <EntrepriseCard key={entreprise.id} entreprise={entreprise} />
              ))}
              {entreprises.length === 0 && (
                <p className="no-data">Aucune entreprise n'est actuellement enregistrée.</p>
              )}
            </div>
          </section>
        );
      case 'investisseurs':
        return (
          <section className="list-section">
            <h2>Liste des Investisseurs</h2>
            <div className="cards-container">
              {investisseurs.map(investisseur => (
                <InvestisseurCard key={investisseur.id} investisseur={investisseur} />
              ))}
              {investisseurs.length === 0 && (
                <p className="no-data">Aucun investisseur n'est actuellement enregistré.</p>
              )}
            </div>
          </section>
        );
      case 'inscription':
        return (
          <section className="inscription-options">
            <h2>Créer un profil</h2>
            <p>Choisissez si vous êtes une entreprise ou un investisseur :</p>
            <div className="button-group">
              <button className="cta-button" onClick={() => setView('form-entreprise')}>
                Je suis une Entreprise
              </button>
              <button className="cta-button" onClick={() => setView('form-investisseur')}>
                Je suis un Investisseur
              </button>
            </div>
          </section>
        );
      case 'form-entreprise':
        return (
          <section className="form-section">
            <EntrepriseForm onSubmit={handleEntrepriseSubmit} />
          </section>
        );
      case 'form-investisseur':
        return (
          <section className="form-section">
            <InvestisseurForm onSubmit={handleInvestisseurSubmit} />
          </section>
        );
      case 'profile':
        if (isLoggedIn && currentUser) {
          return <UserProfile userData={currentUser} onUpdate={handleUpdateProfile} />;
        } else {
          setView('login');
          return null;
        }
      default:
        setView('home');
        return null;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <img src={logo} alt="Fundyy Logo" className="nav-logo" onClick={() => setView('home')} style={{cursor: 'pointer'}}/>
        <div className="nav-items">
          <button 
            className={`nav-link ${view === 'entreprises' ? 'active' : ''}`}
            onClick={() => setView('entreprises')}
          >
            Entreprises
          </button>
          <button 
            className={`nav-link ${view === 'investisseurs' ? 'active' : ''}`}
            onClick={() => setView('investisseurs')}
          >
            Investisseurs
          </button>
        </div>
        <div className="nav-auth">
          {!isLoggedIn ? (
            <>
              <button className="nav-button signup" onClick={() => setView('inscription')}>
                Inscription
              </button>
              <button className="nav-button login" onClick={() => setView('login')}>
                Se connecter
              </button>
            </>
          ) : (
            <>
              <button className="nav-button profile" onClick={() => setView('profile')}>
                Mon compte
              </button>
              <button className="nav-button logout" onClick={handleLogout}>
                Se déconnecter
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
