import React, { useState, useEffect } from 'react';

function UserProfile({ userData, onUpdate }) {
  const [formData, setFormData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setFormData(userData);
    if (userData.image) {
      setPreviewImage(userData.image);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="profile-container">
        <h2>Mon Profil</h2>
        <div className="profile-header">
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} alt="Profil" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <span>Ajouter une photo</span>
              </div>
            )}
          </div>
        </div>
        <div className="profile-info">
          <div className="info-group">
            <h3>Informations personnelles</h3>
            <p><strong>Nom:</strong> {userData.nom}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Téléphone:</strong> {userData.telephone}</p>
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
      
      <div className="profile-image-upload">
        <div className="image-preview">
          {previewImage ? (
            <img src={previewImage} alt="Preview" />
          ) : (
            <div className="image-placeholder">
              <span>Ajouter une photo</span>
            </div>
          )}
        </div>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="image-input"
        />
        <label htmlFor="image" className="image-upload-button">
          Changer la photo
        </label>
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

          <div className="form-group">
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

          <div className="form-group">
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

      <div className="button-group">
        <button type="submit" className="submit-button">
          Enregistrer les modifications
        </button>
        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default UserProfile; 