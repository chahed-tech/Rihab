import React, { useState, useEffect } from 'react';
import './App.css';
import EntrepriseForm from './components/EntrepriseForm';
import InvestisseurForm from './components/InvestisseurForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import logo from './logo.svg';

function App() {
  const [activeTab, setActiveTab] = useState('entreprises');
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({ entreprises: [], investisseurs: [] });

  useEffect(() => {
    // Charger les données depuis le fichier JSON
    fetch('/data/database.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Erreur lors du chargement des données:', error));
  }, []);

  const handleLogin = (loginData) => {
    // Rechercher l'utilisateur dans les données
    const user = [...data.entreprises, ...data.investisseurs].find(
      u => u.email === loginData.email
    );
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowLogin(false);
    } else {
      alert('Email non trouvé');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedData) => {
    if (currentUser.type === 'entreprise') {
      const newData = {
        ...data,
        entreprises: data.entreprises.map(entreprise => 
          entreprise.id === currentUser.id ? updatedData : entreprise
        )
      };
      setData(newData);
      setCurrentUser(updatedData);
    } else {
      const newData = {
        ...data,
        investisseurs: data.investisseurs.map(investisseur => 
          investisseur.id === currentUser.id ? updatedData : investisseur
        )
      };
      setData(newData);
      setCurrentUser(updatedData);
    }
  };

  const handleEntrepriseSubmit = (formData) => {
    const newEntreprise = { ...formData, id: Date.now(), type: 'entreprise' };
    const newData = {
      ...data,
      entreprises: [...data.entreprises, newEntreprise]
    };
    setData(newData);
    setShowForm(false);
    setCurrentUser(newEntreprise);
    setIsLoggedIn(true);
  };

  const handleInvestisseurSubmit = (formData) => {
    const newInvestisseur = { ...formData, id: Date.now(), type: 'investisseur' };
    const newData = {
      ...data,
      investisseurs: [...data.investisseurs, newInvestisseur]
    };
    setData(newData);
    setShowForm(false);
    setCurrentUser(newInvestisseur);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} alt="Business Connect Logo" className="logo" />
          <span className="logo-text">Business Connect</span>
        </div>
        <h1>Business Connect</h1>
        <p>Plateforme de mise en relation entre entreprises et investisseurs</p>
        {!isLoggedIn ? (
          <button className="login-button" onClick={() => setShowLogin(true)}>
            Se connecter
          </button>
        ) : (
          <div className="user-controls">
            <button className="profile-button" onClick={() => setActiveTab('profile')}>
              Mon compte
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        )}
      </header>

      {showLogin ? (
        <div className="login-overlay">
          <LoginForm onLogin={handleLogin} />
          <button className="close-button" onClick={() => setShowLogin(false)}>
            Fermer
          </button>
        </div>
      ) : null}

      {isLoggedIn && activeTab === 'profile' ? (
        <main className="content">
          <UserProfile userData={currentUser} onUpdate={handleUpdateProfile} />
        </main>
      ) : (
        <>
          <nav className="tabs">
            <button 
              className={activeTab === 'entreprises' ? 'active' : ''}
              onClick={() => {
                setActiveTab('entreprises');
                setShowForm(false);
              }}
            >
              Entreprises
            </button>
            <button 
              className={activeTab === 'investisseurs' ? 'active' : ''}
              onClick={() => {
                setActiveTab('investisseurs');
                setShowForm(false);
              }}
            >
              Investisseurs
            </button>
          </nav>

          <main className="content">
            {!showForm ? (
              <section className={activeTab === 'entreprises' ? 'entreprises-section' : 'investisseurs-section'}>
                <h2>{activeTab === 'entreprises' ? 'Pour les Entreprises' : 'Pour les Investisseurs'}</h2>
                <p>
                  {activeTab === 'entreprises' 
                    ? 'Présentez votre projet et trouvez des investisseurs' 
                    : 'Découvrez des opportunités d\'investissement prometteuses'}
                </p>
                <button 
                  className="cta-button"
                  onClick={() => setShowForm(true)}
                >
                  {activeTab === 'entreprises' ? 'Créer un profil entreprise' : 'Créer un profil investisseur'}
                </button>
              </section>
            ) : (
              <section className="form-section">
                {activeTab === 'entreprises' ? (
                  <EntrepriseForm onSubmit={handleEntrepriseSubmit} />
                ) : (
                  <InvestisseurForm onSubmit={handleInvestisseurSubmit} />
                )}
              </section>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
