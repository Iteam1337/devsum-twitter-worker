'use strict';

exports.parseTweet = function parseTweet(tweet) {
    if (!tweet.entities.media) {
      return null;
    }

    try {
      var images = tweet.entities.media.filter(function (media) {
        return media.type === 'photo';
      });

      if (!images.length) {
        return null;
      }

      return {
        id: tweet.id,
        id_str: tweet.id_str,
        text: tweet.text,
        user: {
          id: tweet.user.id,
          id_str: tweet.user.id_str,
          name: tweet.user.name,
          screen_name: tweet.user.screen_name
        },
        images: images.map(function (image) {
          return {
            id: image.id,
            id_str: image.id_str,
            media_url: image.media_url,
            media_url_https: image.media_url_https,
            url: image.url,
            display_url: image.display_url,
            expanded_url: image.expanded_url
          };
        })
      };
    } catch (ex) {
      return null;
    }
};
