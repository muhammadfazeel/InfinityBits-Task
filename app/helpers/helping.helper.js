'use strict'

const config = require('../config/environment.config')
const fs = require('fs')
const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')

const awsConfig = config.awsConfig

const s3 = new AWS.S3({
  'accessKeyId': process.env.accessKeyId || awsConfig.accessKeyId,
  'secretAccessKey': process.env.secretAccessKey || awsConfig.secretAccessKey,
  'region': process.env.region || awsConfig.region
})

// ********************
// Upload Files
// ********************

function uploadFile(file, fileName) {
  return new Promise(function (resolve, reject) {
    var stream = fs.createReadStream(file.path)
    if (!fileName) {
      fileName = Date.now().toString()
    }
    var data = {
      Key: fileName,
      ACL: 'public-read',
      Body: stream,
      ContentType: file.type,
      Bucket: process.env.Bucket || config.Bucket
    }
    s3.upload(data, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// *****************
// Node Mailer
// *****************

function sendMail(data) {
  const output = `
  <h3>Infinity Bits</h3>
  <p>You have Placed New Order</p>
  <h4>Product Information</h4>
  <ul>
  <li>Product Name: ${data.productData.name}</li>
  <li>Product Price: ${data.productData.price}</li>
  </ul>
  <h4>Buyer Information</h4>
  <ul>
    <li>Name: ${data.orderData.name}</li>
    <li>Email: ${data.orderData.email}</li>
    <li>Price Paid: ${data.orderData.paidPrice}</li>
    <li>Purchase Date: ${data.orderData.orderDate}</li>
  </ul>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail', 
          auth: {
            user: 'theproreactdev@gmail.com',
              pass: 'database12'
          }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Infinity Bits" <theproreactdev@gmail.com>', // sender address
    to: data.orderData.email, // list of receivers
    subject: 'Infinity Bits Task', // Subject line
    text: 'Task Task Task', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return nodemailer.getTestMessageUrl(info)
  });
}

module.exports.uploadFile = uploadFile // upload using aws javascript sdk
module.exports.sendMail = sendMail
