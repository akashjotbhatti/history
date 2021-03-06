import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

// api key should be kept private, hence import credentials
const credentials = require('./credentials.json');

/**
 * Parse querystring from route
 * @param {string} find query name
 * @param {string} from route or URL
 * @returns {string}
 */
function parseQueryString(find, from) {
  if (!find || !from) return '';
  const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
  return parts ? parts[2] : '';
}

// location is provided by react-router-dom
function NearbyPage({ location: { search: query } }) {
  const coordinates = parseQueryString('coordinates', query);

  // create useEffect with api information
  useEffect(() => {
    async function fetchData() {
      const serviceRoot = 'https://www.flickr.com/services/rest/';
      const query = `?method=flickr.photos.search&api_key=${credentials.flickr.api_key}&format=json&nojsoncallback=1&per_page=15`;
      const locationQuery = '&lat=49.282875&long=-123.120464&radius=2';

      // connect all queries from above into one and save results
      const serviceUrl = `${serviceRoot}${query}${locationQuery}`;
      const response = await fetch(serviceUrl);
      const result = await response.json();

      // create image path
      const flickrImagePath = (image) => `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg}`;

      // loop over all the images
      const images = result.photos.photo.map((photo) => ({
        caption: photo.title,
        src: flickrImagePath(photo),
      }));

      // define setImageList and use onClick to show active image
      setImageList(images.map((img) => {
        <li>
          <img src={img.src} alt={img.title} onClick={ e => {
            showImage(e,img.src);
          }}/>
        </li>
      }));
    }
    fetchData();
  }, []);

  // add photo variables
  const [imageList, setImageList] = useState([]);
  const [activeImage, setActiveImage] = useState('');

  // define enlargeImage, use activeImage
  const showImage = (e, imagesrc) => {
    setActiveImage(imagesrc);
    e.target.style.border='1px solid powderblue';
  }

  // incase of error show user
  if (!imageList) return (
    <p>Sorry, there seems to be no pictures:( Try a different search!</p>
  );

  return (
    <article>
      <Helmet>
        <title>Nearby</title>
        <meta name="description" content="Description of Nearby" />
      </Helmet>
      <FormattedMessage {...messages.header} />
      {coordinates}
      {activeImage}
      <ul>{imageList}</ul>
    </article>
  );
}

export default memo(NearbyPage);
