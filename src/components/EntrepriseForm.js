import React, { useState } from 'react';
import './Form.css';

function EntrepriseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    secteur: '',
    description: '',
    montantRecherche: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    imageFile: null,
    whatsapp: '',
    facebook: '',
    instagram: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    // Effacer le message d'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérifier la force du mot de passe
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Inscription Entreprise</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="imageFile">Logo de l'entreprise</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {error && <div className="error-message full-width">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="nom">Nom de l'entreprise</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="secteur">Secteur d'activité</label>
          <input
            type="text"
            id="secteur"
            name="secteur"
            value={formData.secteur}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="montantRecherche">Montant recherché (€)</label>
          <input
            type="number"
            id="montantRecherche"
            name="montantRecherche"
            value={formData.montantRecherche}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="Numéro WhatsApp (optionnel)"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="url"
            id="facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="Lien Facebook (optionnel)"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instagram">Instagram</label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="Lien Instagram (optionnel)"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          S'inscrire
        </button>
      </div>
    </form>
  );
}

export default EntrepriseForm; 