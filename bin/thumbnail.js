#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ThumbnailStack } = require('../lib/thumbnail-stack');

const app = new cdk.App();
new ThumbnailStack(app, 'ThumbnailStack');
