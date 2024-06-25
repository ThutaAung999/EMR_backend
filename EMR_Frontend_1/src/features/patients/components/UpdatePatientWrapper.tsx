// components/UpdatePatientWrapper.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePatient from './UpdatePatient';
import { IPatient } from '../model/IPatient';
import { getPatientById } from '../api/update-patient';
const UpdatePatientWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the patient ID from the URL
    const [patient, setPatient] = useState<IPatient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate
  
    useEffect(() => {
      if (id) {
        getPatientById(id)
          .then((data) => {
            setPatient(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }
    }, [id]);
  
    const closeModal = () => {
      navigate('/patients'); // Navigate to the patients list page or any other route you prefer
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (!patient) {
      return <div>No patient data found</div>;
    }
  
    return <UpdatePatient patient={patient} closeModal={closeModal} />;
  };
  
  export default UpdatePatientWrapper;
  