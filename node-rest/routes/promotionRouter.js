module.exports = function(express, bodyParser) {
var Verify = require('./verify');
var promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all(Verify.verifyOrdinaryUser , function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser,function(req,res,next){
        res.end('Will send all the promotions to you!');
})

.post(Verify.verifyAdmin , function(req, res, next){
    res.end(req.body);
})

.delete(Verify.verifyAdmin, function(req, res, next){
        res.end('Deleting all promotions');
});

promotionRouter.route('/:promotionId')
.all(Verify.verifyOrdinaryUser, function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser, function(req,res,next){
        res.end(req.params.promotionId);
})

.put(Verify.verifyAdmin,function(req, res, next){
        res.write(req.params.promotionId);
    res.end(req.body);
})

.delete(Verify.verifyAdmin,function(req, res, next){
        res.end(req.params.promotionId);
});


return promotionRouter;

};
