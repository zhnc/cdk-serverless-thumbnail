const s3Util = require('./s3-util'),
childProcessPromise = require('./child-process-promise'),
path = require('path'),
os = require('os'),
EXTENSION = process.env.EXTENSION,
OUTPUT_BUCKET = process.env.OUTPUT_BUCKET,
MIME_TYPE =  process.env.MIME_TYPE;


exports.handler = function (eventObject, context) {
    console.log('eventObject', eventObject);;
	const eventRecord = eventObject.Records && eventObject.Records[0],
		inputBucket = eventRecord.s3.bucket.name,
		key = eventRecord.s3.object.key,
		id = context.awsRequestId,
		resultKey = 'thumbnail/' + key.replace(/\.[^.]+$/, EXTENSION),
		workdir = os.tmpdir(),
		inputFile = path.join(workdir,  id + path.extname(key)),
		outputFile = path.join(workdir, 'converted-' + id + EXTENSION);


	console.log('converting', inputBucket, key, 'using', inputFile);
	return s3Util.downloadFileFromS3(inputBucket, key, inputFile)
		.then(() => childProcessPromise.spawn(
			'/opt/bin/gs',
			['-sDEVICE=jpeggray','-dSAFER','-dBATCH', '-dNOPAUSE','-sPageList=1','-o', outputFile, inputFile],
			{env: process.env, cwd: workdir}
		))
		.then(() => s3Util.uploadFileToS3(OUTPUT_BUCKET, resultKey, outputFile, MIME_TYPE));
};
