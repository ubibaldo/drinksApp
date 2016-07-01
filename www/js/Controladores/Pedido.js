
angular.module('starter')
  .controller('pedidoCtrl',
  function($scope,
           PedidoService,
           $ionicPopup,
           $timeout,
           $cordovaGeolocation,
           $http,
           $state,
           $rootScope
  )
  {
    $scope.pedido                = PedidoService;
    $scope.pedidoActual          = $scope.pedido.getPedido();
    $scope.mostrarMapa           = false;
    $scope.mostrarTotales        = true;
    $scope.mostrarFormUbicacion  = false;
    $scope.bloquearBtns          = false;
    $scope.tieneProductos        = false;

    if($rootScope.totalProductos > 0)
      $scope.tieneProductos = true;


    //$rootScope.pedidoPendiente = true;
    if(true == $rootScope.pedidoPendiente)
      $state.go('app.pedido-pendiente');


    //***************** geo localizacion  *********************
    /**
     * Muestra el mapa
     */
    var verUbicacion = function(){
      $scope.bloquearBtns = true;
      var styles = [
        {
          stylers: [
            { hue: "#00ffe6" },
            { saturation: -20 }
          ]
        },{
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
          ]
        },{
          featureType: "road",
          elementType: "labels",
          stylers: [
            { visibility: "on" }
          ]
        }
      ];

      $scope.mostrarTotales = false;
      var options = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(options)
        .then(function(position){
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var latitud = position.coords.latitude;
          var longitud = position.coords.longitude;

          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: styles,
            marker: marker
          };

          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

          var marker = new google.maps.Marker({
            position: latLng,
            map     : $scope.map,
            title   : "Dirección de entrega"
          });

          //detectar calle
          var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitud+','+longitud+'&key=AIzaSyDDM7IL8Ep6r1jUoMXZUo0fDGNuigfX-GU';

          $http.get(url)
            .then(function(data){
              $scope.direccion={
                calle:"",
                numero: null
              };
              //console.log(data.data.results[0].formatted_address);
              console.log(data.data.results[0].address_components[1].short_name);

              $scope.direccion.calle  = data.data.results[0].address_components[1].short_name;
              $scope.direccion.numero = data.data.results[0].address_components[0].short_name;

              $scope.pedido.ubicacion.direccion = $scope.direccion;
              $scope.pedido.ubicacion.coordenadas = {
                'lat' : latitud,
                'long': longitud
              }
            });

        }, function(error){
          console.log("Could not get location");
        });
      $scope.mostrarMapa = true;
      $scope.mostrarFormUbicacion= true;
      console.log($scope.pedido);
    };

    $scope.verUbicacion = function(){
      verUbicacion();
    };

    //*******************************************************************************************************************

    /**
     *  Elimina todos los productos del pedido
     */
    $scope.limpiarCarro = function(){

        var confirmPopup = $ionicPopup.confirm({
          title:      'Confirmar acción',
          template:   'Realmente quieres limpiar tu pedido?',
          cancelText: 'Cancelar',
          okText:     'Confirmar'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $scope.pedido.limpiarPedido();
          }
        });
    };

    /**
     * Agrega en 1 la cantidad de un producto de un pedido
     *
     * @param productoPedido
     */
    $scope.addCantidad = function(productoPedido){
      console.log(ionic.Platform.device());
      var producto = productoPedido.producto;
      var cantidad = 1;
      $scope.pedido.addProductoCantidad(producto, cantidad);
      var alertPopup = $ionicPopup.alert({
        title: 'Agregaste 1 unidad al producto',
        buttons: null
      });

       $timeout(function() {
        alertPopup.close();
       }, 2000);

    };

    /**
     * Decrementa en 1 la cantidad de un producto de un pedido
     * @param productoPedido
     */
    $scope.restarCantidad = function(productoPedido){
      console.log(productoPedido);
     var producto = productoPedido.producto;
      if(productoPedido.cantidad == 1)
        return $scope.eliminarProducto(productoPedido)
     var cantidad = -1;
     $scope.pedido.decrementarProductoCantidad(producto, cantidad);
      var alertPopup = $ionicPopup.alert({
        title: 'Quitaste 1 unidad al producto',
        buttons: null
      });

      $timeout(function() {
        alertPopup.close();
      }, 2000);

   };

    /**
     * Elimina un producto de un pedido
     *
     * @param productoPedido
     */
    $scope.eliminarProducto = function(productoPedido){
      var confirmPopup = $ionicPopup.confirm({
        title:      'Confirmar acción',
        template:   'Realmente quieres quitar el producto de tu pedido?',
        cancelText: 'Cancelar',
        okText:     'Confirmar'
      });

      confirmPopup.then(function(res) {
        if(res) {
          var producto = productoPedido.producto;
          $scope.pedido.eliminarProductoPedido(producto);
        }
      });
    };

    $scope.volverAPedido = function(){
      $scope.mostrarMapa           = false;
      $scope.mostrarTotales        = true;
      $scope.mostrarFormUbicacion  = false;
      $scope.bloquearBtns          = false;
    };


    /**
     *
     */
    $scope.confirmarPedido = function(tel, dir_ref){

      $scope.pedido.ubicacion.referencia.tel     = tel;
      $scope.pedido.ubicacion.referencia.dir_ref = dir_ref;
      var url = 'http://23.94.249.163/appDrinks/pedidos/pedidos.php';
      var pedido = angular.fromJson($scope.pedido);

      console.log($scope.pedido);

      $http.post(url,pedido, {headers: { 'Content-Type': 'application/json'}})
        .then(function (data){
          console.log(data);

          var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MjllZTIxOS01MzA4LTRhZDMtYWQ5NS1lZTQ3Y2YxMzhiMTMifQ.QzA7PSQHEEiSz-cEun7iUZdJRyAXd3iIRQSlsWPL0Yw';
          var tokens = ['db0ElKjAjOs:APA91bG8XRFDaNpDbRm4pZ1pwtJV4xcuJxFBf2iOWTC9hMJ-3R1HkvbuqU0wWgv9MIEvs013lu1AUkkNRruf3AMnMKNNGU08Fw4KxWFywL242iKIrQTjAPbXUOGiSXcuJpzgaUwHuiTA'];
          var profile = 'testdevelopment';

          var req = {
            method: 'POST',
            url: 'https://api.ionic.io/push/notifications',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt
            },
            data: {
              "tokens": tokens,
              "profile": profile,
              "notification": {
                "title": "Nuevo pedido",
                "message": "Direccion: "+$scope.pedido.ubicacion.direccion.calle+"\n"+$scope.pedido.ubicacion.direccion.numero,
                "android": {
                  "title": "Nuevo pedido",
                  "message": "Direccion: "+$scope.pedido.ubicacion.direccion.calle+"\n"+$scope.pedido.ubicacion.direccion.numero,
                  "payload": $scope.pedido
                }
              }
            }
          };

// Make the API call
          $http(req).success(function(resp){
            console.log("Mensaje Push: Mensaje success", resp);
            var alertPopup = $ionicPopup.alert({
              title:   'Tu pedido fué enviado, te notificaremos cuando sea procesado. Salud !!',
              buttons: [{
                text: 'Aceptar',
                type: 'button button-positive'
              }]
            });

            alertPopup.then(function(res) {
              //$scope.pedido.limpiarPedido();
              $rootScope.totalProductos = "pendiente";
              $rootScope.pedidoPendiente= true;
              $state.go('app.categorias');
            });

          }).error(function(error){
            // Handle error
            console.log("Mensaje Push: Mensaje error", error);
            $state.go('app.error');
          });
        }).catch(function(){
          alert('error');
          $state.go('app.error');
        });
    };

});
