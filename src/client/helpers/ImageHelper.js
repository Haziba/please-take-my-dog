var React = require('react');

import ImageGallery from 'react-image-gallery';

var ImageHelper = {
  Image: function(image, opts){
    if(!image)
      return;

    return <img src={ImageHelper.CloudinaryImageUrl(image, opts)} />;
  },

  FirstImage: function(images, opts){
    if(!images || images.length < 1)
      return;

    return ImageHelper.Image(images[0], opts);
  },

  Gallery: function(galleryImages){
    if(!galleryImages || galleryImages.length < 1)
      return 'No images available for the gallery';

    const images = galleryImages.map((image) => {
      return {
        original: ImageHelper.CloudinaryImageUrl(image, { gallery_size: true })
      }
    });

    return <ImageGallery items={images} slideInterval={2000} showThumbnails={false}/>;
  },

  CloudinaryImageUrl: function(image, opts){
    let filters = '';

    if(opts){
      if(opts.gallery_size){
        filters += 'c_lpad,h_400,w_500';
      } else if(opts.tile_size){
        filters += 'c_lpad,h_250,w_250';
      } else if(opts.request_size){
        filters += 'c_lpad,h_500,w_600';
      }
    }

    return `https://res.cloudinary.com/haziba/image/upload/${filters}/v${image.version}/${image.public_id}`;
  }
};

module.exports = ImageHelper;
