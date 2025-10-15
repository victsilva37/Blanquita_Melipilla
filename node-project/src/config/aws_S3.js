// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const path = require("path");

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   }
// });

// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// async function uploadFileToS3(file) {
//   const fileName = Date.now() + "-" + path.basename(file.originalname);

//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype
//   };

//   await s3.send(new PutObjectCommand(params));

//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
// }

// module.exports = { uploadFileToS3 };
