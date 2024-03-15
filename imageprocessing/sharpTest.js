const sharp = require('sharp');

sharp('Base.png')
.toBuffer()
  .then(buffer => console.log('Buffer created successfully'))
  .catch(err => console.error('Error creating buffer:', err));
