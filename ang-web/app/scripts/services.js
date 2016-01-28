'use strict';

angular.module('confusionApp')
    .constant('baseURL', 'http://localhost:9988/')
        .service('menuFactory', [ '$resource' , 'baseURL' , function($resource, baseURL) {
                this.getDishes = function(){
                    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                };
                this.getPromotions = function() {
                    return $resource(baseURL+"promotions/:id" , null,  {'update':{method:'PUT' }});
                };

        }])
        .factory('corporateFactory', ['$resource' , 'baseURL' , function($resource , baseURl) {
            var corpfac = {};
            corpfac.getLeaders = function() {
                return $resource(baseURl+"leadership/:id", null, {'update': {method: 'PUT'}});
            };
            return corpfac;
        }])
        .service('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL){
            this.getFeedback = function() {
                return $resource(baseURL+"feedback/:id",null, {'update': {method: 'PUT'}});
            };
        }])

;
