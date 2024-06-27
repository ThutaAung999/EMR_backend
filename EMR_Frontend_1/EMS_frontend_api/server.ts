import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'images'));
  },

  filename: function (req, file, cb) {
    let date = new Date();
    let imageFileName = date.getTime() + '_' + file.originalname;
    (req as any).body.imageFileName = imageFileName;
    cb(null, imageFileName);
  }
});

const upload = multer({ storage: storage }).any();

interface ProductRequest extends Request {
  body: {
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    imageFileName?: string;
    createdAt?: string;
  };
}

app.post('/products', upload, (req: ProductRequest, res: Response, next: NextFunction) => {
  let date = new Date();
  req.body.createdAt = date.toISOString();

  if (req.body.price) req.body.price = Number(req.body.price);

  let hasErrors = false;
  let errors: { [key: string]: string } = {};

  if (req.body.name.length < 2) {
    hasErrors = true;
    errors.name = "The name's length should be at least 2 characters";
  }

  if (req.body.brand.length < 2) {
    hasErrors = true;
    errors.brand = "The brand's length should be at least 2 characters";
  }

  if (req.body.category.length < 2) {
    hasErrors = true;
    errors.category = "The category's length should be at least 2 characters";
  }

  if (req.body.price <= 0) {
    hasErrors = true;
    errors.price = 'The price is not valid';
  }

  if (req.body.description.length < 10) {
    hasErrors = true;
    errors.description = "The description's length should be at least 10 characters";
  }

  if (hasErrors) {
    res.status(400).json(errors);
    return;
  }

  // Continue to the next middleware or route handler if validation passes
  next();
});

// Error handling middleware for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(3004, () => {
  console.log('Server is running on port 3004');
});
