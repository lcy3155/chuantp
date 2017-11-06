var express = require('express');
var router = express.Router();
var mysql=require('mysql');
///第一步
var fs=require('fs');   //重新命名
var formidable=require('formidable');   //写入文件的模块

var con=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'item'
})

/* GET home page. */
router.post('/list', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //跨域
  //第二步
  var form = new formidable.IncomingForm();   //创建formidable.IncomingForm()对象
  form.uploadDir='public/images';
  form.parse(req,function(error,fields,files){   // console.log(fields)  //console.log(files、图片的属性)

    for (i in files){
      var file = files[i];  //保存图片属性
      // console.log(file)
      var fName = (new Date()).getTime() //用时间戳来作为图片的新name

      switch(file.type){
        case 'image/jpeg':
          fName=fName+".jpg";
          break;
        case 'image/png':
          fName=fName+".png";
          break;
        case 'image/gif':
          fName=fName+".gif";
          break;
        case 'image/psd':
          fName=fName+".psd";
          break;

      }
      var newPath = 'public/images/'+fName;
      fs.renameSync(file.path,newPath);
      //接受两个参数  第一个是原有的图片的路径、名字
      //                第二个是新路径
      res.send(newPath)
      con.query(`INSERT INTO img1(img) VALUES('images/${fName}')`,function(err,rows){
        if (err) throw err;
        if(rows){
          res.send('上传成功')
        }
      })
    }

  });
});

//调取图片
 router.post('/list1',function(req,res){
 	res.header("Access-Control-Allow-Origin", "*");
 	con.query('SELECT * FROM img1',function(err,rows){
 		if(err) throw err;
 		res.send(rows);
 	})
 })



module.exports = router;
