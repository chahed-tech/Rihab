import React, { useState, useEffect } from 'react';
import './App.css';
import EntrepriseForm from './components/EntrepriseForm';
import InvestisseurForm from './components/InvestisseurForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import ChatBot from './components/ChatBot';
import FloatingWords from './components/FloatingWords';
import logo from './assets/images/Fundyy.png';

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
  const [entreprises, setEntreprises] = useState([]);
  const [investisseurs, setInvestisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'entreprises', 'investisseurs'

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedEntreprises = JSON.parse(localStorage.getItem('entreprises')) || [];
        const storedInvestisseurs = JSON.parse(localStorage.getItem('investisseurs')) || [];
        
        setEntreprises(storedEntreprises);
        setInvestisseurs(storedInvestisseurs);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError('Erreur lors du chargement des données.');
      }
    };

    loadData();
  }, []);

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

  // Fonction pour convertir une image en base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Si c'est déjà une chaîne (probablement déjà en base64), retourner directement
      if (typeof file === 'string') {
        resolve(file);
        return;
      }

      // Si ce n'est pas un objet File, rejeter la promesse
      if (!(file instanceof File)) {
        reject(new Error('Le fichier doit être un objet File valide'));
        return;
      }

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
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      let imageToUpdate = updatedData.image;

      if (updatedData.imageFile) {
        imageToUpdate = await convertImageToBase64(updatedData.imageFile);
      }

      const isEntreprise = Boolean(currentUser.secteur || updatedData.secteur);
      const userType = isEntreprise ? 'entreprise' : 'investisseur';

      const dataToUpdate = {
        ...currentUser,
        ...updatedData,
        image: imageToUpdate,
        type: userType
      };

      delete dataToUpdate.imageFile;

      // Mettre à jour dans localStorage
      if (isEntreprise) {
        const updatedEntreprises = entreprises.map(entreprise => 
          entreprise.id === currentUser.id ? dataToUpdate : entreprise
        );
        setEntreprises(updatedEntreprises);
        localStorage.setItem('entreprises', JSON.stringify(updatedEntreprises));
      } else {
        const updatedInvestisseurs = investisseurs.map(investisseur => 
          investisseur.id === currentUser.id ? dataToUpdate : investisseur
        );
        setInvestisseurs(updatedInvestisseurs);
        localStorage.setItem('investisseurs', JSON.stringify(updatedInvestisseurs));
      }

      setCurrentUser(dataToUpdate);
      setView('profile');
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert(error.message || 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  const handleEntrepriseSubmit = async (formData) => {
    try {
      let imageUrl = null;
      if (formData.imageFile) {
        imageUrl = await convertImageToBase64(formData.imageFile);
      }

      const newEntreprise = {
        ...formData,
        type: 'entreprise',
        image: imageUrl,
        id: Date.now(),
        dateInscription: new Date().toISOString(),
        statut: 'actif'
      };

      delete newEntreprise.imageFile;

      // Ajouter à localStorage
      const updatedEntreprises = [...entreprises, newEntreprise];
      setEntreprises(updatedEntreprises);
      localStorage.setItem('entreprises', JSON.stringify(updatedEntreprises));

      setCurrentUser(newEntreprise);
      setIsLoggedIn(true);
      setView('profile');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleInvestisseurSubmit = async (formData) => {
    try {
      let imageUrl = null;
      if (formData.imageFile) {
        imageUrl = await convertImageToBase64(formData.imageFile);
      }

      const newInvestisseur = {
        ...formData,
        type: 'investisseur',
        image: imageUrl,
        id: Date.now(),
        dateInscription: new Date().toISOString(),
        statut: 'actif'
      };

      delete newInvestisseur.imageFile;

      // Ajouter à localStorage
      const updatedInvestisseurs = [...investisseurs, newInvestisseur];
      setInvestisseurs(updatedInvestisseurs);
      localStorage.setItem('investisseurs', JSON.stringify(updatedInvestisseurs));

      setCurrentUser(newInvestisseur);
      setIsLoggedIn(true);
      setView('profile');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'investisseur:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  // Composant de recherche
  const SearchBar = () => {
    // Ne pas afficher la barre de recherche si on n'est pas dans les sections entreprises ou investisseurs
    if (view !== 'entreprises' && view !== 'investisseurs') {
      return null;
    }

    return (
      <div className="search-container">
        <div className="search-controls">
          <input
            type="text"
            placeholder={view === 'entreprises' ? "Rechercher par secteur d'activité..." : "Rechercher par secteur d'intérêt..."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="search-input"
          />
        </div>
        <div className="search-info">
          {view === 'entreprises' && (
            <p>Recherchez les entreprises par secteur d'activité. Exemple: Technologie, Santé, Éducation...</p>
          )}
          {view === 'investisseurs' && (
            <p>Recherchez les investisseurs par secteur d'intérêt. Exemple: Technologie, Santé, Éducation...</p>
          )}
        </div>
      </div>
    );
  };

  // Fonction pour filtrer les résultats de recherche
  const filterResults = (items, type) => {
    if (!searchTerm) return items;
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      if (type === 'entreprise') {
        return item.secteur && item.secteur.toLowerCase().includes(lowerSearchTerm);
      } else {
        return item.secteursInteret && item.secteursInteret.toLowerCase().includes(lowerSearchTerm);
      }
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="home-content">
            <FloatingWords />
            <img src={logo} alt="Fundyy Logo Spinning" className="home-logo" />
            <div className="home-welcome">
              <h1>Bienvenue sur Fundy</h1>
              <p>La plateforme qui connecte les entreprises innovantes aux investisseurs</p>
            </div>
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
            <SearchBar />
            <div className="cards-container">
              {filterResults(entreprises, 'entreprise').map(entreprise => (
                <EntrepriseCard key={entreprise.id} entreprise={entreprise} />
              ))}
              {filterResults(entreprises, 'entreprise').length === 0 && (
                <p className="no-data">Aucune entreprise ne correspond à votre recherche.</p>
              )}
            </div>
          </section>
        );
      case 'investisseurs':
        return (
          <section className="list-section">
            <h2>Liste des Investisseurs</h2>
            <SearchBar />
            <div className="cards-container">
              {filterResults(investisseurs, 'investisseur').map(investisseur => (
                <InvestisseurCard key={investisseur.id} investisseur={investisseur} />
              ))}
              {filterResults(investisseurs, 'investisseur').length === 0 && (
                <p className="no-data">Aucun investisseur ne correspond à votre recherche.</p>
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

      <main>
        {renderContent()}
      </main>

      <ChatBot />
    </div>
  );
}

export default App;
