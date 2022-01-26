// Load the AWS SDK for Node.js
const S3 = require('aws-sdk/clients/s3');
const fetch = require('node-fetch');
var async = require("async");
var Promise = require('promise');
var forEach = require('async-foreach').forEach;
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
let objectList = new Object();
// Call S3 to list the buckets
var count = 1;
let countPerURL =  new Object();
// var presignedURL = null;
s3.listObjects(bucketParams, function(err, bucketList) {
	objectList = bucketList.Contents;

 //  	for (const element of objectList) {

 //    	let presignedURL = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: element.Key, Expires: signedUrlExpireSeconds});
 //    	console.log(presignedURL);
 //    	hyperquest(presignedURL)
	//     .pipe(JSONStream.parse('*'))
	//     .pipe(es.map((data, callback) => {

	//       	if(location_country[data.location_country] != null) 
	//       	{
	// 	    	location_country[data.location_country] += 1;
	// 		} 
	// 		else 
	// 		{
	// 	    	location_country[data.location_country] = 1;
	// 	    }

	// 	    if(countPerURL[presignedURL] != null) 
	//       	{
	// 	    	countPerURL[presignedURL] += 1;
	// 		} 
	// 		else 
	// 		{
	// 	    	countPerURL[presignedURL] = 1;
	// 	    }

	// 	    console.log(countPerURL);
	      	
	//     }));
	// }


	const forLoop = async (element) => {
	  console.log('Start')

	  for (const element of objectList) {
	  	console.log('get url');
	  	
	  	await getJson(element);
	  	// await getJson();
	  	// .getJson(presignedURL);

	  	// .then( funtion(presignedURL) { 
	  	// 	console.log(url); let waiting = getJson(url); 
	  	// });
	  	
    	// let waiting = await getJson(url);
	  }

	  console.log('End');
	}

	const getJson = async (element) =>
	{
		let presignedURL = getUrl(element);
		console.log(presignedURL);
		await hyperquest(presignedURL)
	    .pipe(JSONStream.parse('*'))
	    .pipe(es.map((data, callback) => {

	      	if(location_country[data.location_country] != null) 
	      	{
		    	location_country[data.location_country] += 1;
			} 
			else 
			{
		    	location_country[data.location_country] = 1;
		    }
		    console.log(presignedURL);
	      	console.log(location_country);
	    }));
	}

	function getUrl(element)
	{
		// let presignedURL =  s3.getSignedUrl('getObject', { Bucket: bucketName, Key: element.Key, Expires: signedUrlExpireSeconds});
		return s3.getSignedUrl('getObject', { Bucket: bucketName, Key: element.Key, Expires: signedUrlExpireSeconds});
	}

	forLoop();

});





// for(const element of objectList)
// {
	// console.log('forEach start');
 //  	let presignedURL = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: element.Key, Expires: signedUrlExpireSeconds});
	//  hyperquest(presignedURL)
 //    .pipe(JSONStream.parse('*'))
 //    .pipe(es.map((data, callback) => {

 //      	if(location_country[data.location_country] != null) 
 //      	{
	//     	location_country[data.location_country] += 1;
	// 	} 
	// 	else 
	// 	{
	//     	location_country[data.location_country] = 1;
	//     }
 //      	console.log(location_country);
 //      	console.log(presignedURL);
 //    }));
// }

