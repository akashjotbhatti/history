export function transformSourceOptions(items = []) {
  const features = items.map(item => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [item.geo[0], item.geo[1]],
    },
    properties: {},
  }));

  const data = {
    type: 'FeatureCollection',
    features,
  };

  const options = {
    id: 'thumbs',
    geoJsonSource: {
      type: 'geojson',
      data,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    },
  };

  return options;
}

export function transformMapOptions(geo = []) {
  const [longitude = null, latitude = null] = geo;

  const invalidPoint = (
    longitude === 0
    || latitude === 0
    || longitude === undefined
    || latitude === undefined
    || longitude === null
    || latitude === null
  );
  const point = invalidPoint ? null : [longitude, latitude];

  const options = {
    containerStyle: {
      height: '100vh',
      width: '100vw',
    },
    style: 'mapbox://styles/mapbox/satellite-streets-v10',
  };

  if (point) {
    options.center = point;
    options.zoom = [14];
  }

  return options;
}

const clusterOptions = {
  id: 'clusters',
  type: 'circle',
  paint: {
    'circle-color': {
      property: 'point_count',
      type: 'interval',
      stops: [
        [0, '#51bbd6'],
        [100, '#f1f075'],
        [750, '#f28cb1'],
      ],
    },
    'circle-radius': {
      property: 'point_count',
      type: 'interval',
      stops: [
        [0, 20],
        [100, 30],
        [750, 40],
      ],
    },
  },
  filter: ['has', 'point_count'],
  sourceId: 'thumbs',
};

const clusterLabelOptions = {
  id: 'cluster-count',
  type: 'symbol',
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
  filter: ['has', 'point_count'],
  sourceId: 'thumbs',
};

const unclusterOptions = {
  id: 'unclustered-point',
  type: 'circle',
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
  filter: ['!has', 'point_count'],
  sourceId: 'thumbs',
};

export {
  clusterOptions,
  clusterLabelOptions,
  unclusterOptions,
}