const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (fileBuffer, fileName) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: "image/jpeg",
      ACL: "public-read", // hace pública la URL
    };

    const result = await s3.upload(params).promise();
    console.log("Imagen subida a S3:", result.Location);
    return result;
  } catch (error) {
    console.error("Error en uploadToS3:", error);
    throw new Error("Error subiendo la imagen a S3");
  }
};

module.exports = { uploadToS3 };
