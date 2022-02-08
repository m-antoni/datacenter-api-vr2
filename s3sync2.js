// Load the AWS SDK for Node.js
const S3 = require('aws-sdk/clients/s3');
const fetch = require('node-fetch');
var async = require("async");
var Promise = require('promise');
var forEach = require('async-foreach').forEach;
var fs = require('fs'), JSONStream = require('JSONStream'), es = require('event-stream');
const hyperquest = require('hyperquest');
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb+srv://datacenter-user03:80YWAXIohLbFeZel@talently-cluster01.lavtd.mongodb.net/datacenter-db";

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
  Prefix: "2/"
};

let settings = { method: "Get" };

var location_country =  new Object();
location_country["other country"] = 0;
location_country["US"] = 0;
location_country["US With Email"] = 0;
location_country["US With Mobile/Phone"] = 0;
location_country["US No Email/Mobile/Phone"] = 0;

let objectList = new Object();
// Call S3 to list the buckets
var count = 1;
let countPerURL =  new Object();
// var presignedURL = null;
s3.listObjects(bucketParams, function(err, bucketList) {
	objectList = bucketList.Contents;
	console.log(objectList);
	const forLoop = async (bruh) => {
	  for (const element of objectList) {
	  	console.log('get url');
	  	console.log(element.Key);
    	var promises = [];
    	const params = {
		    Bucket: bucketName,
		    Key: element.Key
		 };

		 var fileName = element.Key;
		 fileName = fileName.split('/');

		 let folderWithSlash = fileName[0];
		 if(fileName[1])
		 {
		  	console.log(params);

		    var newPromise = new Promise(async (resolve, reject) => {

		    	console.log('promise');
		        await s3.getObject(params).createReadStream()
		        .on('end', () => {
		        	console.log('done writing');
		            return resolve();
		        })
		        .on('error', (error) => {
		        	console.log('error writing');
		            return reject(error);
		        }).pipe(JSONStream.parse('*')).pipe(es.map((data, callback) => {
		        	// console.log(data);
			      	if(data.location_country != null) 
			      	{
			      		let insert = 0;
			      		// emails
				    	if(data.location_country == 'united states')
				    	{
				    		location_country["US"] += 1;

				    		if(data.emails)
				    		{
				    			location_country["US With Email"] += 1;
				    			insert = 1;
				    		}
				    		else if (data.mobile_numbers)
				    		{
				    			location_country["US With Mobile/Phone"] += 1;
				    			insert = 1;
				    		}
				    		else if( data.phone_numbers)
				    		{
				    			location_country["US With Mobile/Phone"] += 1;
				    			insert = 1;
				    		}
				    		else
				    		{
				    			location_country["US No Email/Mobile/Phone"] += 1;
				    		}
				    	}
				    	else
				    	{
				    		location_country["other country"] += 1;
				    	}

				    	if(insert == 1)
				    	{
				    		

				    		var InsertPromise = new Promise(async (resolve, reject) => {

				    			await MongoClient.connect(MongoUrl, function(err, db) {
								  if (err) throw err;
								  var dbo = db.db("datacenter-db");
								  var collection = dbo.collection("peoples");

								  var query = { linkedin_url: data.linkedin_url };
								  // console.log(query);

								  collection.find(query).limit(1).next(function(err, result) {
								  	// console.log(result);
								  	if(!result)
								  	{
								  		data.dumpFile = element.Key;
								  		collection.insertOne(data, function(err, res) {
									    if (err) throw err;
									    	console.log(data.linkedin_url + " inserted");
									    	console.log(element.Key);
									    	db.close();
									 	});
								  	}	
								  	else
								  	{
									 	data.dumpFile = element.Key;
									 	var newvalues = { $set: data };

								  		collection.updateOne(query, newvalues, function(err, res) {
										    if (err) throw err;
										    console.log(data.linkedin_url + " updated");
										    console.log(element.Key);
										    db.close();
										});
								  	}
								  });
								  
								});
				    		});

				    		InsertPromise.then(() => {
						    	console.log("Insert Promise");
						    });
				    	}
					} 
					else 
					{
				    	location_country["other country"] += 1;
				    }
				    // console.log(params);
				    // console.log(location_country);
			    }));
		        // .pipe(file);

		    });

		    // promises.push(newPromise);

		    await newPromise.then(() => {
		    	console.log("Processing Promise");
		    });
		 }
	  }

	  console.log('End');
	  // console.log(promises);
	  // await Promise.all(promises);
	}

	forLoop();

});