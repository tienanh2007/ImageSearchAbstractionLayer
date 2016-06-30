var express = require("express")
var mongodb = require("mongodb")
var Bing = require('node-bing-api')({ accKey: "Z0omZrx7OqWfU/zrUN2LEieDvNWSi2b08o12VXOJLkI"})
var app = express()
var MongoClient = mongodb.MongoClient
var url1 = 'mongodb://localhost:27017/ImageSearch'
MongoClient.connect(url1, function (err, db) {
  if (err) throw err
  var collection = db.collection("searches")
    collection.find({},{_id:0}).toArray(function(err, docs) {
      state.docs = docs
      db.close()
  })
})
var state = {
  docs: null
}
var temp = null
app.get('/',function(req,res){
  res.send(state.docs)
})
app.get('/:query',function(req,respond){
  Bing.images(req.params.query, {
    top: req.param('offset')?req.param('offset'):10,
    skip: req.param('skip')?req.param('skip'):0,
    imageFilters: {
      size: 'small',
      color: 'monochrome'
    }
  }, function(err, res, body){
    console.log(body)
    var json = body.d.results.map(function(rel){
      return parseImageUrl(rel)
    })
    var searched = {
      "search" : req.params.query,
      "when" : Date()
    }
    console.log(searched)
    MongoClient.connect(url1, function (err, db) {
      if (err) throw err
      var collection = db.collection("searches")
      collection.insert(searched)
      collection.find({}).toArray(function(err, docs) {
        state.docs = docs
        db.close()
      })
    })
    respond.send(json)
  })
})
// app.get('/:pag',function(req,res){
//   var pag = req.params.pag
//   var user = req.param('user')
//   res.send(pag + " " + user)
// })
app.listen(process.env.PORT||3000,function(){
  console.log("listening on port")
})
var parseImageUrl = function(result){
  var ans
  ans = {
    "Title": result.Title,
    "Url": result.MediaUrl,
    "Context": result.SourceUrl
  }
  return ans
}
