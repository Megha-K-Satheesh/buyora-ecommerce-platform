const { S3Client, PutObjectCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");
const logger = require("../utils/logger");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  return fileUrl;

};



const testS3Connection = async () => {
  try {
    await s3.send(
      new HeadBucketCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
      })
    );

       logger.info('S3 connected successfully');
  } catch (error) {
    logger.info("S3 connection failed ", error.message);
  }
};

testS3Connection();
module.exports = { 
  s3,
  uploadToS3,
};
