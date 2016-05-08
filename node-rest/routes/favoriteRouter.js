/**
 * Created by test most on 5/8/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Favorites = require('../models/favorite');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser , function(req,res, next) {
        var userId = req.decoded._doc._id;
        Favorites.find({postedBy: userId})
            .populate('postedBy') //populate user
            .populate('dishes') //populate dishes
            .exec(function(err, favorite) {
                if (err) throw err;
                res.json(favorite);
            })
    })
    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        var userId = req.decoded._doc._id;
        //implementing add or update
        Favorites.findOne({postedBy: userId} , function(err, favorite) {
            if(!favorite) { //add
                 var newFavorite = { postedBy: userId, dishes: [req.body.id]};
                 Favorites.create(newFavorite, function (err, favorite) {
                     if (err) throw err;
                     console.log('Favorite created!');
                     res.json(favorite);
                  });
            } else { //update
                var index = favorite.dishes.indexOf(req.body.id);
                if(index == - 1) {
                    favorite.dishes.push(req.body.id);
                    favorite.save( function(err, response) {
                        if (err) throw err;
                        console.log('Added a new favorite dish!!');
                        res.json(response);
                    })
                } else {
                    res.json(favorite); //fallback if the user wants to input the same item in favorites
                }
            }
        });

    })

    .delete(Verify.verifyOrdinaryUser, function(req,res,next) {
        var userId = req.decoded._doc._id;
        Favorites.remove({postedBy: userId} , function(err, response) {
           if(err) throw err;
           res.json(response)
        })
    })

;

favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        var userId = req.decoded._doc._id;
        Favorites.findOne({postedBy: userId}, function(err, favorite) {
            if(favorite) {
               favorite.dishes.splice(req.params.dishId, 1); //remove from the array
               favorite.save(function (err, resp) { //save
                if (err) throw err;
                       res.json(resp);
                });
            } else {
                res.json(favorite); //fallback if the user has no favorites
            }

        })
    });
module.exports = favoriteRouter;