/**
 * Cloudinary Helper
 * Extracts the public_id from a Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  const parts = url.split('/');
  const filename = parts.pop().split('.')[0];
  const folder = parts.pop();
  return `${folder}/${filename}`;
};

module.exports = {
  getPublicIdFromUrl
};
