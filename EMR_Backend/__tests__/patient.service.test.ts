import mongoose from 'mongoose';
import Patient, { IPatient } from '../src/model/patient.model';
import patientService from '../src/services/patient.service';
import '../__tests__/setupTest';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import Disease, { IDisease } from '../src/model/diasease.model'; // corrected import path
import DoctorModel, { IDoctor } from '../src/model/doctor.model';
import { fail } from 'assert';

describe('Patient Service', () => {
  let patientId: string;
  let doctorId: mongoose.Types.ObjectId;
  let diseaseId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    // Create a new doctor and save it
    const doctor = new DoctorModel({
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      patients: [],
    });
    const savedDoctor = await doctor.save();
    doctorId = savedDoctor._id;

    // Create a new disease and save it
    const disease = new Disease({
      name: 'Flu',
      description: 'Influenza',
      patients: [],
      medicines: [],
    });
    const savedDisease = await disease.save();
    diseaseId = savedDisease._id;

    // Create a new patient linked to the doctor and disease
    const patient = new Patient({
      name: 'John Doe',
      age: 30,
      doctors: [doctorId],
      diseases: [diseaseId],
    });
    const savedPatient = await patient.save();
    patientId = savedPatient._id.toString();
  });

  afterEach(async () => {
    // Clean up after each test by deleting all patients, doctors, and diseases
    await Patient.deleteMany({});
    await DoctorModel.deleteMany({});
    await Disease.deleteMany({});
  });

  // Tests for different functionalities of the Patient Service
  test('should get all patients with populated doctors and diseases', async () => {
    const patients = await patientService.getAllPatient();
    expect(patients).toHaveLength(1);
    expect(patients[0].name).toBe('John Doe');

    // Assert doctors array in the fetched patient
    if (Array.isArray(patients[0].doctors) && patients[0].doctors.length > 0) {
      const doctor = patients[0].doctors[0] as unknown as IDoctor;
      expect(doctor.name).toBe('Dr. Smith');
    } else {
      fail('Doctors array is empty or not an array of IDoctor');
    }

    // Assert diseases array in the fetched patient
    if (Array.isArray(patients[0].diseases) && patients[0].diseases.length > 0) {
      const disease = patients[0].diseases[0] as unknown as IDisease;
      expect(disease.name).toBe('Flu');
    } else {
      fail('Diseases array is empty or not an array of IDisease');
    }
  });

  test('should create a new patient with ObjectId references', async () => {
    // Create a new patient
    const newPatient = await patientService.newPatient({
      name: 'Jane Doe',
      age: 28,
      doctors: [doctorId.toString()],
      diseases: [diseaseId.toString()],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as IPatient);
    expect(newPatient.name).toBe('Jane Doe');

    // Verify that the number of patients is now 2
    const patients = await patientService.getAllPatient();
    expect(patients).toHaveLength(2);
  });

  test('should update a patient with populated doctors and diseases', async () => {
    // Update an existing patient
    const updatedPatient = await patientService.updatePatient(patientId, {
      name: 'John Smith',
      age: 35,
      doctors: [doctorId.toString()],
      diseases: [diseaseId.toString()],
      updatedAt: new Date(),
    } as unknown as IPatient);
    expect(updatedPatient?.name).toBe('John Smith');
  });

  test('should delete a patient', async () => {
    // Delete an existing patient
    await patientService.deletePatient(patientId);

    // Verify that there are no patients left
    const patients = await patientService.getAllPatient();
    expect(patients).toHaveLength(0);
  });
});
