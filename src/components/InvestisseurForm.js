import React, { useState } from 'react';

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
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...dataToSubmit } = formData;
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
        <label htmlFor="typeInvestisseur">Type d'investisseur</label>
        <select
          id="typeInvestisseur"
          name="typeInvestisseur"
          value={formData.typeInvestisseur}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionnez un type</option>
          <option value="particulier">Particulier</option>
          <option value="business_angel">Business Angel</option>
          <option value="fond_investissement">Fond d'investissement</option>
          <option value="entreprise">Entreprise</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="montantMin">Montant minimum d'investissement (€)</label>
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
        <label htmlFor="montantMax">Montant maximum d'investissement (€)</label>
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
        <label htmlFor="secteursInteret">Secteurs d'intérêt (séparés par des virgules)</label>
        <input
          type="text"
          id="secteursInteret"
          name="secteursInteret"
          value={formData.secteursInteret}
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
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
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
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>

      <button type="submit" className="submit-button">
        Enregistrer
      </button>
    </form>
  );
}

export default InvestisseurForm; 