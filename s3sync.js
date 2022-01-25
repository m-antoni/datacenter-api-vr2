// Load the AWS SDK for Node.js
const S3 = require('aws-sdk/clients/s3');
const fetch = require('node-fetch');
var fs = require('fs'), JSONStream = require('JSONStream'), es = require('event-stream');
const hyperquest = require('hyperquest');

const bucketName = 'talentlylidump'
const region = 'us-east-2'
const accessKeyId = 'AKIAW7D5VTTAHMVSTUUD'
const secretAccessKey = '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'
const signedUrlExpireSeconds = 60*10000;

const s3 = new S3({
    region,
    accessKeyId, 
    secretAccessKey
});

var bucketParams = {
  Bucket : bucketName,
};

let settings = { method: "Get" };

var location_country =  new Object();
// Call S3 to list the buckets
s3.listObjects(bucketParams, function(err, data) {
  let objectList = data.Contents;
  // console.log(objectList.Contents);
  objectList.forEach(element => {
  	const queueFile = async() => {

  		const getFiles = async() => {

	  		const presignedURL = s3.getSignedUrl('getObject', {
		    Bucket: bucketName,
		    Key: element.Key,
			    Expires: signedUrlExpireSeconds
			});

			const parser = async () => {
			  await hyperquest(presignedURL)
			    .pipe(JSONStream.parse('*'))
			    .pipe(es.map(async (data, callback) => {
			      // console.log(data.location_country);
			      // var obj = new Object();

			      	if(location_country[data.location_country] != null) {
				    	location_country[data.location_country] += 1;
					} else {
				    	location_country[data.location_country] = 1;
				    }
			      // callback(null, data);
			      console.log(location_country);
			    }))
			}
			await parser();

	  	}
	  	
  		await getFiles();
  	}
  	
  	queueFile();
  	
  	
  });

});

console.log(location_country);
