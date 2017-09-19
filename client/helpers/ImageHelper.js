var React = require('react'),
  Image = require('cloudinary-react').Image;

import ImageGallery from 'react-image-gallery';

var ImageHelper = {
  Image: function(image){
    if(!image)
      return;

    return <Image cloudName={'haziba'} publicId={image.public_id}></Image>;
  },

  FirstImage: function(images){
    if(!images || images.length < 1)
      return;

    return ImageHelper.Image(images[0]);
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
        filters += 'c_scale,h_500';
      } else if(opts.tile_size){
        filters += 'c_scale,h_250';
      }
    }

    return `https://res.cloudinary.com/haziba/image/upload/${filters}/v${image.version}/${image.public_id}`;
  }
};

module.exports = ImageHelper;
