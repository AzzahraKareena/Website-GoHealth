
import React, { useState } from 'react';
import './ProfileAdmin.css';
import profileImage from './profile.jpg';
import EditProfileForm from './EditProfileFormAdmin';

const ProfileAdmin = () => {
  const admin = {
    adminemail: localStorage.getItem('admin_email')
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState({
    nama: localStorage.getItem('admin_nama') || '',
    foto_profile: localStorage.getItem('admin_foto_profile') || profileImage,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setEditedAdmin((prevUser) => ({ ...prevUser, [name]: reader.result }));
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setEditedAdmin((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    localStorage.setItem('admin_nama', editedAdmin.nama);
    localStorage.setItem('admin_foto_profile', editedAdmin.foto_profile);

    setIsEditing(false);

    fetch(`https://localhost:8080/update/admin/${localStorage.getItem('admin_id')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedAdmin),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
        <div className="avatar-container">
          <img src={editedAdmin.foto_profile} alt="Avatar" className="avatar" />
        </div>
        <div className="welcome-message">
          <p>Selamat datang, {editedAdmin.nama}!</p>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-info">
          {isEditing ? (
            <EditProfileForm
              editedAdmin={editedAdmin}
              onInputChange={handleInputChange}
              onSaveClick={handleSaveClick}
              onCancelClick={() => setIsEditing(false)}
            />
          ) : (
            <>
              <p id="email">{admin.adminemail}</p>
              <button className="edit-profile-button" onClick={handleEditClick}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;