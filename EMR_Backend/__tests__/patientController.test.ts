// patientController.test.ts
/*
import { IRequest, IResponse } from "../src/types/types";
import * as patientController from "../src/controllers/patient.controller";
import * as patientService from "../src/services/patient.service";
import { NextFunction } from "express";
import { IPatient } from "../src/model/patient.model";
import { zodPatientSchema } from "../src/schema/patient.schema";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  jest,
  it,
} from "@jest/globals";
import { Types } from "mongoose";
import DoctorModel, { IDoctor } from "../src/model/doctor.model";
import Disease, { IDisease } from "../src/model/diasease.model";

jest.mock("../src/services/patient.service");
describe("Patient Controller", () => {
  let req: IRequest;
  let res: IResponse;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as IRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as IResponse;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  describe("getAllPatients", () => {
    it("should return all patients with a 200 status", async () => {
      const patients: IPatient[] = [
        {
          _id: new Types.ObjectId(),
          name: "John Doe",
          age: 30,
          doctors: [] as IDoctor | Types.ObjectId[],
          diseases: [] as IDisease | Types.ObjectId[],
          createdAt: new Date(),
          updatedAt: new Date(),
          // Mock the additional properties/methods
          $assertPopulated: jest.fn(),
          $clone: jest.fn(),
          $getAllSubdocs: jest.fn(),
          $ignore: jest.fn(),
          // add other properties/methods if needed
        },
      ];
      (patientService.getAllPatient as jest.Mock).mockResolvedValue(patients);

      await patientController.getAllPatients(req, res, next);

      expect(patientService.getAllPatient).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patients);
    });

    it("should handle errors", async () => {
      const error = new Error("Error fetching patients");
      (patientService.getAllPatient as jest.Mock).mockRejectedValue(error);

      await patientController.getAllPatients(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });



  describe("getPatientById", () => {
    it("should return a patient by id with a 200 status", async () => {
      const patient: IPatient = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        age: 30,
        doctors: [],
        diseases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.params = { patientId: patient._id.toString() };
      (patientService.getPatientById as jest.Mock).mockResolvedValue(patient);

      await patientController.getPatientById(req, res, next);

      expect(patientService.getPatientById).toHaveBeenCalledWith(
        patient._id.toString()
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patient);
    });

    it("should handle patient not found", async () => {
      const patientId = new Types.ObjectId().toString();
      req.params = { patientId };
      (patientService.getPatientById as jest.Mock).mockResolvedValue(null);

      await patientController.getPatientById(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("No patient found"));
    });

    it("should handle errors", async () => {
      const error = new Error("Error fetching patient");
      const patientId = new Types.ObjectId().toString();
      req.params = { patientId };
      (patientService.getPatientById as jest.Mock).mockRejectedValue(error);

      await patientController.getPatientById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findPatientByName", () => {
    it("should return patients by name with a 200 status", async () => {
      const patients: IPatient[] = [
        {
          _id: new Types.ObjectId(),
          name: "John Doe",
          age: 30,
          doctors: [],
          diseases: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      req.params = { name: "John" };
      (patientService.searchPatientByName as jest.Mock).mockResolvedValue(
        patients
      );

      await patientController.findPatientByName(req, res, next);

      expect(patientService.searchPatientByName).toHaveBeenCalledWith("John");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patients);
    });

    it("should handle no patients found", async () => {
      req.params = { name: "Unknown" };
      (patientService.searchPatientByName as jest.Mock).mockResolvedValue([]);

      await patientController.findPatientByName(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No patients found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Error searching patients");
      req.params = { name: "John" };
      (patientService.searchPatientByName as jest.Mock).mockRejectedValue(
        error
      );

      await patientController.findPatientByName(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to search for patients",
      });
    });
  });

  describe("newPatient", () => {
    it("should create a new patient with a 201 status", async () => {
      const patient: IPatient = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        age: 30,
        doctors: [],
        diseases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.body = patient;
      (zodPatientSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: patient,
      });
      (patientService.newPatient as jest.Mock).mockResolvedValue(patient);

      await patientController.newPatient(req, res, next);

      expect(patientService.newPatient).toHaveBeenCalledWith(patient);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(patient);
    });

    it("should handle validation errors", async () => {
      const validationError = { errors: [{ message: "Validation error" }] };
      (zodPatientSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: false,
        error: validationError,
      });

      await patientController.newPatient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Validation error" });
    });

    it("should handle errors", async () => {
      const error = new Error("Error creating patient");
      const patient: IPatient = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        age: 30,
        doctors: [],
        diseases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.body = patient;
      (zodPatientSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: patient,
      });
      (patientService.newPatient as jest.Mock).mockRejectedValue(
        error as never
      );

      await patientController.newPatient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: error });
    });
  });

  describe("updatePatient", () => {
    it("should update a patient with a 200 status", async () => {
      const patient: IPatient = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        age: 30,
        doctors: [],
        diseases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.params = { patientId: patient._id.toString() };
      req.body = patient;
      (patientService.updatePatient as jest.Mock).mockResolvedValue(
        patient as never
      );

      await patientController.updatePatient(req, res, next);

      expect(patientService.updatePatient).toHaveBeenCalledWith(
        patient._id.toString(),
        patient
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patient);
    });

    it("should handle errors", async () => {
      const error = new Error("Error updating patient");
      const patientId = new Types.ObjectId().toString();
      req.params = { patientId };
      req.body = { name: "John Doe" };
      (patientService.updatePatient as jest.Mock).mockRejectedValue(
        error as never
      );

      await patientController.updatePatient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe("deletePatient", () => {
    it("should delete a patient with a 200 status", async () => {
      const patient: IPatient = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        age: 30,
        doctors: [],
        diseases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.params = { patientId: patient._id.toString() };
      (patientService.deletePatient as jest.Mock).mockResolvedValue(
        patient as never
      );

      await patientController.deletePatient(req, res, next);

      expect(patientService.deletePatient).toHaveBeenCalledWith(
        patient._id.toString()
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patient);
    });

    it("should handle errors", async () => {
      const error = new Error("Error deleting patient");
      const patientId = new Types.ObjectId().toString();
      req.params = { patientId };
      (patientService.deletePatient as jest.Mock).mockRejectedValue(
        error as never
      );

      await patientController.deletePatient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
*/