const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Thumbnail = require('../lib/thumbnail-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Thumbnail.ThumbnailStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});