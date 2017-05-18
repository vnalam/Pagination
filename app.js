var express = require('express');
var bodyParser = require('body-parser');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var port = process.env.port || 1007;
var app = express();
app.use(bodyParser())
app.use(express.static(__dirname + '/public'));
//cors headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var rc = redis.createClient(6379, 'localhost');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('vinay', 'root', 'vinayraj4', {
  host: "127.0.0.1",
  port: 3306,
  maxConcurrentQueries: 1000,
  dialect: 'mariadb'
  })
  
  var User = sequelize.define('home', {
			
			eName:Sequelize.STRING,
			eEmail: Sequelize.STRING,
			salary: Sequelize.INTEGER
		 });
app.post('/api/insert', function(req, res) 
	{
			User.create({
			eName:req.body.eName,
			eEmail:req.body.eEmail,
			salary:req.body.salary
		}).then(function(vin) {
			res.json(vin)
			console.log(vin.get({
			plain: true
			}));
		});
	});	

	
app.get('/api/retrieve/:salary/:limit/:offset', function(req, res) 
	{
		var salary = req.param('salary');
		
		var limit = parseInt(req.param('limit'));
		var offset = parseInt(req.param('offset'));
		console.log(limit);
			var cacheObj = cacher(sequelize, rc)
		.model('home')
		.ttl(1000);
		cacheObj.findAll({where:{salary:salary}, limit:limit, offset:offset})
  .then(function(user) {
    console.log(user); // sequelize db object 
    console.log(cacheObj.cacheHit); // true or false 
	res.json({"output":user})
	//res.send(salary+''+limit+''+offset);
  });
	});	

	
app.listen(port);
console.log('Server is running on port ' + port);		 
		 
		 