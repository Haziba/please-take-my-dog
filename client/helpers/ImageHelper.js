var React = require('react'),
  Image = require('cloudinary-react').Image,
  Transformation = require('cloudinary-react').Transformation;

import ImageGallery from 'react-image-gallery';

var ImageHelper = {
  Image: function(image, opts){
    console.log("wut");
    if(!image)
      return;

    let filters = {};

    if(opts){
      if(opts.gallery_size){
        filters.width = 500;
        filters.height = 400;
      } else if(opts.tile_size){
        filters.width = 320;
        filters.height = 240;
      }
    }
console.log("lol");
    if(opts){
      console.log(filters);
      return <Image cloudName={'haziba'} publicId={image.public_id}>
</Image>;
      /*return <Image cloudName={'haziba'} publicId={image.public_id}>
            <Transformation width={filters.width} height={filters.height}/>
          </Image>;*/
    } else {
      return <Image cloudName={'haziba'} publicId={image.public_id} />;
    }
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
        filters += 'c_lpad,h_240,w_320';
      }
    }

    return `https://res.cloudinary.com/haziba/image/upload/${filters}/v${image.version}/${image.public_id}`;
  }
};

module.exports = ImageHelper;
