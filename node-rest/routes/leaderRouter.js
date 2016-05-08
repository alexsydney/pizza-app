module.exports = function(express, bodyParser) {
var Verify = require('./verify');
var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all(Verify.verifyOrdinaryUser , function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser , function(req,res,next){
        res.end('Will send all the leadership to you!');
})

.post(Verify.verifyAdmin, function(req, res, next){
    res.end(req.body);
})

.delete(Verify.verifyAdmin , function(req, res, next){
        res.end('Deleting all leaders');
});

leaderRouter.route('/:leaderId')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser, function(req,res,next){
        res.end(req.params.leaderId);
})

.put(Verify.verifyAdmin ,function(req, res, next){
        res.write(req.params.leaderId);
    res.end(req.body);
})

.delete(Verify.verifyAdmin , function(req, res, next){
        res.end(req.params.leaderId);
});


return leaderRouter;

};
