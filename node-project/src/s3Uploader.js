const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Sube un buffer a S3 y devuelve la URL pública
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 */
const uploadToS3 = async (fileBuffer, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  return await s3.upload(params).promise();
};

module.exports = { uploadToS3 };
