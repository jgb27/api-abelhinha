import dotenv from 'dotenv';
dotenv.config()
import multer from 'multer';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.MY_AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  }
});
console.log("Região de hospedagem da S3: " + process.env.MY_AWS_DEFAULT_REGION)

const imageStorage = multerS3({
  s3: s3,
  bucket: 'abelhinha-bucket',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      const extensionFile = file.originalname.split('.')[1];
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        cb(null, `image/${process.env.ENVIRONMENT}/${hash.toString('hex')}.${extensionFile}`);
      });
    } else if (file.mimetype === 'application/pdf') {
      cb(null, `ebook/${process.env.ENVIRONMENT} / ${file.originalname} `)
    } else {
      cb(new Error('Formato de arquivo não suportado!'))
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado!'));
  }
}

export const upload = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
});

