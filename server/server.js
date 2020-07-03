// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.models.user.afterRemote('create',(ctx,user,next)=>{
  console.log(ctx);
  console.log('New user is',user);
  app.models.Profile.create({
    first_name:user.username,
    name:user.name,
    date:new Date(),
    email:user.email,
    userId:user.id,
    role:'subscriber'
  },(err,result)=>{
    if(!err && result){
      console.log('Here is your result',result);
    }
    else{
      console.log('Error produced here is',err);
    }
    next();

  });
});

app.models.Role.find({where:{name:'admin'}},(err,role)=>{
  if(!err && role){
    console.log('Here it is',role);
  if(role.length === 0){
app.models.Role.create(
  {name:'admin'},
  (err2,result)=>{       
    if(!err2 && result){

      app.models.user.findOne((usererr,user)=>{
        if(!usererr && user){
          result.principals.create({
            principalType:app.models.RoleMapping.USER,
            principalId:user.id,
          },(princierr,pricipal)=>{
            console.log('Created',princierr,pricipal);
          });
        }
      });
    }
  });
  
  }
 }
});

app.models.Role.find({where :{
  name:'editor'
}},(err,roles)=>{
  if(!err && roles){
    console.log('Here it is',err,roles);
    if(roles.length===0){
      app.models.Role.create({
        name:'editor'
      },(creationerr,result)=>{
        if(!creationerr && result){
        console.log('Created ',creationerr,result);
      }});
    }
  }
});