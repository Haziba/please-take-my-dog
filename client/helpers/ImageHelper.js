var ImageHelper = {
  CloudinaryImageUrl: function(image){
    return `http://res.cloudinary.com/haziba/image/upload/v${image.version}/${image.public_id}`;
  }
};

module.exports = ImageHelper;
