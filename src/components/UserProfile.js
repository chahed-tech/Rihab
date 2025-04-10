import React, { useState, useEffect } from 'react';

function UserProfile({ userData, onUpdate }) {
  const [formData, setFormData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          {userData.image && (
            <div className="profile-image-container">
              <img 
                src={userData.image} 
                alt={userData.type === 'entreprise' ? userData.nom : `${userData.prenom} ${userData.nom}`}
                className="profile-image"
              />
            </div>
          )}
          <div>
            <h2>{userData.type === 'entreprise' ? userData.nom : `${userData.prenom} ${userData.nom}`}</h2>
            <p className="profile-type">{userData.type === 'entreprise' ? 'Entreprise' : 'Investisseur'}</p>
          </div>
        </div>
        <div className="profile-info">
          <div className="info-group">
            <h3>Informations personnelles</h3>
            <p><strong>Nom:</strong> {userData.nom}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Téléphone:</strong> {userData.telephone}</p>
            <p><strong>WhatsApp:</strong> {userData.whatsapp || 'Non renseigné'}</p>
            <p><strong>Facebook:</strong> {userData.facebook || 'Non renseigné'}</p>
            <p><strong>Instagram:</strong> {userData.instagram || 'Non renseigné'}</p>
          </div>

          {userData.type === 'entreprise' ? (
            <div className="info-group">
              <h3>Informations entreprise</h3>
              <p><strong>Secteur:</strong> {userData.secteur}</p>
              <p><strong>Description:</strong> {userData.description}</p>
              <p><strong>Montant recherché:</strong> {userData.montantRecherche} €</p>
            </div>
          ) : (
            <div className="info-group">
              <h3>Informations investisseur</h3>
              <p><strong>Type:</strong> {userData.typeInvestisseur}</p>
              <p><strong>Montant min:</strong> {userData.montantMin} €</p>
              <p><strong>Montant max:</strong> {userData.montantMax} €</p>
              <p><strong>Secteurs d'intérêt:</strong> {userData.secteursInteret}</p>
            </div>
          )}
        </div>
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Modifier mes informations
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Modifier mon profil</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="imageFile">Photo de profil</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="form-input"
          />
        </div>
      
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
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp || ''}
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
            value={formData.facebook || ''}
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
            value={formData.instagram || ''}
            onChange={handleChange}
            placeholder="Lien Instagram (optionnel)"
          />
        </div>

        {userData.type === 'entreprise' ? (
          <>
            <div className="form-group">
              <label htmlFor="secteur">Secteur d'activité</label>
              <input
                type="text"
                id="secteur"
                name="secteur"
                value={formData.secteur}
                onChange={handleChange}
                required
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
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="typeInvestisseur">Type d'investisseur</label>
              <select
                id="typeInvestisseur"
                name="typeInvestisseur"
                value={formData.typeInvestisseur}
                onChange={handleChange}
                required
              >
                <option value="particulier">Particulier</option>
                <option value="business_angel">Business Angel</option>
                <option value="fond_investissement">Fond d'investissement</option>
                <option value="entreprise">Entreprise</option>
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

            <div className="form-group full-width">
              <label htmlFor="secteursInteret">Secteurs d'intérêt</label>
              <input
                type="text"
                id="secteursInteret"
                name="secteursInteret"
                value={formData.secteursInteret}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="button-group full-width">
          <button type="submit" className="submit-button">
            Enregistrer les modifications
          </button>
          <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
            Annuler
          </button>
        </div>
      </div>
    </form>
  );
}

export default UserProfile; 