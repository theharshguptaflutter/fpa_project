const aws = require("aws-sdk");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

aws.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_ID_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

async function s3Upload(image, BUCKET_NAME = process.env.BUCKET_NAME) {
  //const BUCKET_NAME = process.env.BUCKET_NAME;  //bucket_name;
  var s3 = new aws.S3();

  var base64String = image;
  var imageData = Buffer.from(base64String, "base64");

  var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  var fileName = uniqueSuffix + ".png";

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: imageData,
    ACL: "public-read",
    //ContentType: "model/gltf-binary",
    ContentType: "image/png",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        //  console.log(data["Location"]);
        resolve(data["Location"]);
      }
    });
  });
}

async function s3VideoUpload(video) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const s3 = new aws.S3();

  var base64Stringvid = video;
  var productVideo = Buffer.from(base64Stringvid, "base64");

  var uniqueSuffixVid = Date.now() + "-" + Math.round(Math.random() * 1e9);
  var fileNamevid = uniqueSuffixVid + ".mp4";

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileNamevid, // File name you want to save as in S3
    Body: productVideo, //image body
    acl: "public-read",
    ContentType: "video/mp4",
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data["Location"]);
        resolve(data["Location"]);
      }
    });
  });
}

module.exports = { s3Upload, s3VideoUpload };
