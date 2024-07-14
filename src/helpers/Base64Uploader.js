import fs from 'fs';

const saveBase64File = (base64ImageData) => {
  try {
    const buffer = Buffer.from(base64ImageData.split(',')[1], 'base64');
    const prefix = base64ImageData.split(',')[0];
    const fileType = prefix.split(':')[1].split('/')[0];
    const mimeType = prefix.split(':')[1].split('/')[1];
    const filename = `${Date.now()}-${Math.random().toString(36)}`;
    const extension = `${mimeType}`;

    let targetDir;

    if (fileType === 'image') 
      targetDir = 'uploads/images/';
    else if (fileType === 'video') 
      targetDir = 'uploads/videos';
    else
      targetDir = 'uploads/files/';

    const filePath = `${targetDir}${filename}.${extension}`;
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved file: ${filename}.${extension}`);

    return filePath;
  } catch (error) {
    console.log(error);
  }
};

export default saveBase64File;
