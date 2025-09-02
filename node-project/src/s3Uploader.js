const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function uploadToS3(buffer, fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ACL: "public-read",
    ContentType: "image/jpeg", // o detectarlo dinámicamente
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("Imagen subida a S3:", data.Location);
    return data;
  } catch (error) {
    console.error("Error subiendo a S3:", error);
    throw error;
  }
}

module.exports = { uploadToS3 };
