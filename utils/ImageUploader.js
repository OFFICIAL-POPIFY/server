const AWS =require( 'aws-sdk');
const multer =require( 'multer');
const multerS3 = require('multer-s3');
const path = require('path'); // path 모듈을 추가로 임포트합니다.


AWS.config.update({
    region:'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,

});

const s3 = new AWS.S3()

const allowedExtensions=['.png','.jpg','.jpeg','.bmp']

const imageUploader =multer({

    storage: multerS3({

        s3: s3,
        bucket: 'nodeimage',
        key: (req,file,callback) =>{
            const uploadDirectory = req.query.directory ?? ''
            const extension =path.extname(file.originalname)
            if(!allowedExtensions.includes(extension)){
                return callback(new Error('wrong extension'))
            }
            callback(null,`${uploadDirectory}/${Date.now()}_&{file.originalname}`)
        },
        acl: 'public-read-write'
    }),
})
module.exports = imageUploader;