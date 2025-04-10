import React, { useState } from 'react';
import './Form.css';

function InvestisseurForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    typeInvestisseur: '',
    montantMin: '',
    montantMax: '',
    secteursInteret: '',
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
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Inscription Investisseur</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="imageFile">Photo de profil</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {error && <div className="error-message full-width">{error}</div>}

        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="typeInvestisseur">Type d'investisseur</label>
          <select
            id="typeInvestisseur"
            name="typeInvestisseur"
            value={formData.typeInvestisseur}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="Business Angel">Business Angel</option>
            <option value="Fonds d'investissement">Fonds d'investissement</option>
            <option value="Investisseur privé">Investisseur privé</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="montantMin">Montant minimum (€)</label>
          <input
            type="number"
            id="montantMin"
            name="montantMin"
            value={formData.montantMin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="montantMax">Montant maximum (€)</label>
          <input
            type="number"
            id="montantMax"
            name="montantMax"
            value={formData.montantMax}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="secteursInteret">Secteurs d'intérêt</label>
          <input
            type="text"
            id="secteursInteret"
            name="secteursInteret"
            value={formData.secteursInteret}
            onChange={handleChange}
            required
            placeholder="Séparez les secteurs par des virgules"
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
          />
        </div>

        <button type="submit" className="submit-button">
          S'inscrire
        </button>
      </div>
    </form>
  );
}

export default InvestisseurForm; 