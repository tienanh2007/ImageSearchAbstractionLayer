var Bing = require('node-bing-api')({ accKey: "Z0omZrx7OqWfU/zrUN2LEieDvNWSi2b08o12VXOJLkI"})
var val = 5
exports.search = function(cb){
  Bing.web("Pizza", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 results
    options: ['DisableLocationDetection', 'EnableHighlighting']
  }, function(err, res, body){
    if(err) throw err
    // body has more useful information, but for this example we are just
    // printing the first two results
    done = cb(body)
    console.log(JSON.stringify(val))
  });
  return val
}
var valueGetter = function(value){
  val = value
  return true
}
exports.search(valueGetter)
console.log(JSON.stringify(val))
