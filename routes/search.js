var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var key = 'd1763339908ab9aa';
var fullcontact = require('fullcontact').createClient(key);

var name = "";
var url = 'mongodb://localhost:27017/fdata';
router.get('/', function(req, res, next) {
  res.render('index');
});
/* GET home page. */
router.get('/search', function(req, res, next) {
  res.render('search');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  
  //var param = req.body.fname;
  //var textAnswer = document.getElementById("fname");
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    //resultArray.push(db.collection('userData').findOne({'contactInfo.givenName':'Sadain'}));
    //res.render('index', {items: resultArray});
     db.collection('userData').findOne({'contactInfo.givenName':'Sadain'},  function(err, doc) {
        assert.equal(null, err);
        res.render('index', {item: doc});
        console.log('textAnswer');
        db.close();
       
      });
    
   /* cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      
      res.render('index', {items: resultArray});
    });*/
  });
});


router.post('/search', function(req, res, next) {
   fname = req.body.fname;
   email = req.body.email;
   lname = req.body.lname;
   
    mongo.connect(url, function(err, db) {
    assert.equal(null, err);
      
        db.collection('userData').findOne({'contactInfo.givenName':fname,'contactInfo.familyName':lname},  function(err, doc) {
          if(doc)
        {
          res.render('index', {item: doc});
          console.log('textAnswer');
          db.close();
        }
        else
        {
              db.collection('userData').findOne({'contactInfo.givenName':fname},  function(err, doc) {
              if(doc)
              {
                res.render('index', {item: doc});
                console.log('textAnswer');
                db.close();
              }
              else
              {
                 db.collection('userData').findOne({'contactInfo.familyName':lname},  function(err, doc) {
                      if(doc)
                      {
                        res.render('index', {item: doc});
                        console.log('textAnswer');
                        db.close();
                      }
                      else
                      {
                            //db.close();
                            //fullcontact
                            fullcontact.person.email(email, function (err, data) {
                                
                              
                                if (err)
                                  {
                                  res.render('notfound');
                                  }
                                else
                                  {
                                          db.collection('userData').insertOne(data, function(err, result) {
                                              if (err)
                                              {
                                              console.log('collection error');
                                              res.render('MongoError');
                                              }
                                              else
                                              {
                                                if(data.status = 202)
                                                {
                                                  console.log('202');
                                                  res.render('queued');
                                                }
                                                else
                                                {
                                                  res.render('index', {item: data});
                                                console.log('Item inserted');
                                                db.close();
                                                }
                                                
                                              }
                                            });
                                  }
                              
                              
                            });
                            
                        
                      }
                      });
                 
              }
             
            });
          
        }
        });
   });     
});
/*router.post('/search', function(req, res, next) {
  
  fname = req.body.fname;
   email = req.body.email;
   lname = req.body.lname;
   
    mongo.connect(url, function(err, db) {
    assert.equal(null, err);
      
        db.collection('userData').findOne({'contactInfo.givenName':fname},  function(err, doc) {
        if(doc)
        {
          res.render('index', {item: doc});
          console.log('textAnswer');
          db.close();
        }
        else
        {
           db.collection('userData').findOne({'contactInfo.familyName':lname},  function(err, doc) {
                if(doc)
                {
                  res.render('index', {item: doc});
                  console.log('textAnswer');
                  db.close();
                }
                else
                {
                      //db.close();
                      //fullcontact
                      fullcontact.person.email(email, function (err, data) {
                          
                        
                          if (err)
                            {
                            res.render('notfound');
                            }
                          else
                            {
                                    db.collection('userData').insertOne(data, function(err, result) {
                                        if (err)
                                        {
                                        console.log('collection error');
                                        res.render('MongoError');
                                        }
                                        else
                                        {
                                          if(data.status = 202)
                                          {
                                            console.log('202');
                                            res.render('queued');
                                          }
                                          else
                                          {
                                            res.render('index', {item: data});
                                          console.log('Item inserted');
                                          db.close();
                                          }
                                          
                                        }
                                      });
                            }
                        
                        
                      });
                      
                  
                }
                });
           
        }
       
      });
  });
});
*/
router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('userData').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('userData').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;
