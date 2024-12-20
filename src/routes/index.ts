import express, { Express } from 'express';
import patientRouter from './patients.route';
import medicineRouter from './medicines.route';
import diseaseRouter from './diseases.route';
import doctorRouter from './doctors.route';
import tagRouter from './tags.route';
import emrImageRouter from './emr.images.route';
import emrImagesUploadRouter from './emrImagesUpload.route';
import emrRouter from './emr.route';

const setupRoutes = (app: Express) => {
  //const apiRouter = express.Router();

  app.use('/api/patients', patientRouter);
  app.use('/api/medicines', medicineRouter);
  app.use('/api/diseases', diseaseRouter);
  app.use('/api/doctors', doctorRouter);
  app.use('/api/tags', tagRouter);
  app.use('/api/emrImages', emrImageRouter);
  app.use('/api/emrsImagesUpload', emrImagesUploadRouter);
  app.use('/api/emrs', emrRouter);
};

export default setupRoutes;
