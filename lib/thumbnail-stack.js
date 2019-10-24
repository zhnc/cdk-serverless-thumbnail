const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam')
const path = require('path');
const s3n = require('@aws-cdk/aws-s3-notifications');

class ThumbnailStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // s3 bucket for pdf and thumbnail image
    const imgBucket = new s3.Bucket(this, 'img-bucket', {
    });

    //ghostscript environment in lambda layer
    const layer = new lambda.LayerVersion(this, 'ghostscript-layer', {
        code: lambda.Code.fromAsset(path.join(__dirname, '../tmp/gs.zip')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
        license: 'Apache-2.0',
        description: 'A layer to host ghostscript',
    });


    //lambda IAM role
    const pdf2jpgLambdaRole = new iam.Role(this, 'pdf2jpg-lambda-Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    //lambda IAM role policy
    pdf2jpgLambdaRole.addToPolicy(new iam.PolicyStatement({
        resources: [imgBucket.bucketArn + '/*'],
        actions: ['s3:PutObject', 's3:GetObject']
    }));

    pdf2jpgLambdaRole.addToPolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));


    //create lambda function
    const pdf2jpgLambda = new lambda.Function(this, 'pdf2jpg-lambda', {
        code: lambda.Code.asset('pdf2jpg-lambda'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_10_X,
        layers: [layer],
        timeout: cdk.Duration.minutes(5),
        role: pdf2jpgLambdaRole,
        memorySize: 512,
//        environment: {
//            EXTENSION: '.jpg',
//            MIME_TYPE: 'image/jpeg',
//            OUTPUT_BUCKET: imgBucket.bucketName
//          }
    });

    //create lambda function s3 trigger event
    imgBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(pdf2jpgLambda), { suffix: '.pdf' });
  }
}

module.exports = { ThumbnailStack }
