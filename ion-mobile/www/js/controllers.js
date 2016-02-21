angular.module('conFusion.controllers', [])

  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }})


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $ionicPlatform.ready(function() {
    var CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    var ImgPickerOptions= {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
    };
    $scope.choosePicture = function() {
      $cordovaImagePicker.getPictures(ImgPickerOptions)
        .then(function (results) {
          $scope.registration.imgSrc = "data:image/jpeg;base64," + results[0];
        }, function(err) {
          console.log(err);
        });

      $scope.registerform.show();

    };

    $scope.takePicture = function() {
      $cordovaCamera.getPicture(CameraOptions).then(function(imageData) {
        $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        console.log(err);
      });

      $scope.registerform.show();

    };
  });
  $scope.registration = {};
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.registerform = modal;
  });

  // Triggered in the registration modal to close it
  $scope.closeRegister = function () {
    $scope.registerform.hide();
  };
  //registration

  // Open the registration modal
  $scope.register = function () {
    $scope.registerform.show();
  };

  // Perform the registration action when the user submits the registration form
  $scope.doRegister = function () {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a registration delay. Remove this and replace with your registration
    // code if using a registration system
    $timeout(function () {
      $scope.closeRegister();
    }, 1000);
  };

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
     $localStorage.storeObject('userinfo',$scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

    //open the reservation modal
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveModal = modal;
    });

    $scope.reserve = function() {
      $scope.reserveModal.show();
    };

    $scope.closeReserve = function() {
      $scope.reserveModal.hide();
    }

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    };

  })



  .controller( 'MenuController' , ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.dishes = dishes;
      console.log(dishes);


      $scope.select = function(setTab) {
          $scope.tab = setTab;

          if (setTab === 2) {
              $scope.filtText = "appetizer";
          }
          else if (setTab === 3) {
              $scope.filtText = "mains";
          }
          else if (setTab === 4) {
              $scope.filtText = "dessert";
          }
          else {
              $scope.filtText = "";
          }
      };

      $scope.isSelected = function (checkTab) {
          return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function() {
          $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function(index){
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();//used to close option button in teh view
        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favorite",
            text: $scope.dishes[index].name
          }).then(function () {
              console.log('Added Favorite ' + $scope.dishes[index].name);
            },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });
      }
  }])

  .controller('ContactController', ['$scope', function($scope) {

      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

      var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

      $scope.channels = channels;
      $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

      $scope.sendFeedback = function() {


          if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
              $scope.invalidChannelSelection = true;
              console.log('incorrect');
          }
          else {
              $scope.invalidChannelSelection = false;
              feedbackFactory.save($scope.feedback);
              $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
              $scope.feedback.mychannel="";
              $scope.feedbackForm.$setPristine();
              console.log($scope.feedback);
          }
      };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory' , 'dish', 'baseURL', '$ionicPopover', 'favoriteFactory', '$ionicModal', '$cordovaLocalNotification', '$cordovaToast',
    function($scope, $stateParams, menuFactory , dish, baseURL , $ionicPopover , favoriteFactory , $ionicModal , $cordovaLocalNotification, $cordovaToast) {
      $scope.baseURL = baseURL;
      $scope.dish = dish;

        //defining modal for adding a comment
        $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.commentModal = modal;
        });

        //defining popover for adding to favorites
        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
        });


      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };

      $scope.addFavorite = function() {
        favoriteFactory.addToFavorites($scope.dish.id);
        //add a notification
        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favorite",
            text: $scope.dish.name
          }).then(function () {
              console.log('Added Favorite ' + $scope.dish.name);
            },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Added Favorite ' + $scope.dish.name, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });
        $scope.popover.hide();
      };

      $scope.openCommentModal = function() {
        $scope.commentModal.show();
      };

      $scope.closeCommentModal = function() {
        $scope.commentModal.hide();
      };

      $scope.addComment = function(comment) {
        //todo add validation and merge with dishdetail comment controller
        comment.date = new Date().toISOString();
        $scope.dish.comments.push(comment);
        $scope.commentModal.hide();
        $scope.popover.hide();
      };



  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

      $scope.mycomment = {rating:5, comment:"", author:"", date:""};

      $scope.submitComment = function () {

          $scope.mycomment.date = new Date().toISOString();
          console.log($scope.mycomment);

          $scope.dish.comments.push($scope.mycomment);
  menuFactory.update({id:$scope.dish.id},$scope.dish);

          $scope.commentForm.$setPristine();

          $scope.mycomment = {rating:5, comment:"", author:"", date:""};
      }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'leader', 'dish', 'promotion' , 'baseURL', function($scope, leader, dish, promotion, menuFactory, corporateFactory , promotionFactory , baseURL) {
                  $scope.baseURL = baseURL;
                  $scope.leader = leader;
                  $scope.dish = dish;
                  $scope.promotion = promotion;

              }])

  .controller('AboutController', ['$scope', 'leaders' , 'baseURL', function($scope, leaders, baseURL) {
              $scope.baseURL = baseURL;
              $scope.leaders = leaders

              }])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration'
  function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout , $cordovaVibration) {


    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;
    $scope.dishes = dishes;




    $scope.toggleDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

      $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            //vibrate for 200ms
            $cordovaVibration.vibrate(200);
            favoriteFactory.deleteFromFavorites(index);
          } else {

          }
        });

        $scope.shouldShowDelete = false;

      }


    }])




;
