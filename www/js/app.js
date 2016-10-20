angular.module('starter', ['ionic','ionic.service.core','ngCordova', 'starter.controllers','ionic.service.push', 'chart.js', 'ionicImgCache'])

.run(function($ionicPlatform, $http, $rootScope, $q, dispositivoService) {

    $rootScope.server = '23.94.249.163';
    $rootScope.env = 'app_dev.php';
    $rootScope.urls={};
    $rootScope.urls.dispositivo          = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/dispositivo/administradores';
    $rootScope.urls.categorias           = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/categorias';
    $rootScope.urls.listadoProductos     = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/producto/';
    $rootScope.urls.estadoApertura       = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/horario';
    $rootScope.urls.listarPedidos        = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/pedidos';
    $rootScope.urls.detallePedido        = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/pedido/';
    $rootScope.urls.pedidoEstado         = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/pedido/estado';
    $rootScope.urls.dispositivoId        = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/dispositivo/';
    $rootScope.urls.registrarDispositivo = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/dispositivo/uuid';
    $rootScope.urls.pedidoNuevo          = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/pedido/nuevo';
    $rootScope.urls.stock                = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/productos';
    $rootScope.urls.cambiarStock         = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/producto/cambiar-stock';
    $rootScope.urls.abrirCerrar          = 'http://'+$rootScope.server+'/app-drink/web/'+ $rootScope.env +'/api/horario/abrir-cerrar';

    $rootScope.urls.productos = 'http://'+$rootScope.server+'/app-drink/web/img/productos/';




    /**
     *  Obtengo los token de los dispositivos administradores
     *
     */
    var getTokenAdmins = function(){
      var tokenAdmins = [];
      dispositivoService.getAdministradores()
        .then(function(dispAdm){
          angular.forEach(dispAdm, function (valor) {
            tokenAdmins.push(valor.token) ;
          });
          $rootScope.tokenAdm = tokenAdmins;
        });

    };

    getTokenAdmins();

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.categorias', {
      url: '/categorias',
      views: {
        'menuContent': {
          templateUrl: 'templates/categorias.html',
          controller: 'categoriasCtrl'
        }
      }
    })

    .state('app.h', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })

  .state('app.listado', {
    url: '/categorias/:categoria',
    views: {
      'menuContent': {
        templateUrl: 'templates/listadoProductos.html',
        controller: 'listadoProductosCtrl'
      }
    }
  })

    .state('app.promociones', {
      url: '/promociones',
      views: {
        'menuContent': {
          templateUrl: 'templates/promociones.html',
          controller: 'promocionesCtrl'
        }
      }
    })

    .state('app.contacto', {
      url: '/contacto',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacto.html',
          controller: 'contactoCtrl'
        }
      }
    })

    .state('app.admin', {
      url: '/admin',
      views: {
        'menuContent': {
          templateUrl: 'templates/Admin/home.html',
          controller: 'adminCtrl'
        }
      }
    })

    .state('app.pedDet', {
      url: '/admin/pedido/:pedido',
      views: {
        'menuContent': {
          templateUrl: 'templates/Admin/pedido-detalle.html',
          controller: 'pedidoDetalleCtrl'
        }
      }
    })

    .state('app.estadistica', {
      url: '/estadistica',
      views: {
        'menuContent': {
          templateUrl: 'templates/Admin/estadistica.html',
          controller: 'estadisticaCtrl'
        }
      }
    })

    .state('app.stock', {
      url: '/stock',
      views: {
        'menuContent': {
          templateUrl: 'templates/Admin/stock.html',
          controller: 'stockCtrl'
        }
      }
    })

    .state('app.error', {
      url: '/error',
      views: {
        'menuContent': {
          templateUrl: 'templates/error.html'
        }
      }
    })

    .state('app.salir', {
      url: '/salir',
      views: {
        'menuContent': {
          templateUrl: 'templates/salir.html',
          controller: 'salirCtrl'
        }
      }
    })

    .state('app.pedido', {
      url: '/mi-pedido',
      views: {
        'menuContent': {
          templateUrl: 'templates/mi-pedido.html',
          controller: 'pedidoCtrl'
        }
      }
    })

    .state('app.pedido-pendiente', {
      url: '/pedido-pendiente',
      views: {
        'menuContent': {
          templateUrl: 'templates/pedido-pendiente.html',
          controller: 'pedidoPendienteCtrl'
        }
      }
    })

    .state('app.producto', {
      url: '/producto/producto-detalle/:producto',
      views: {
        'menuContent': {
          templateUrl: 'templates/producto/detalleProducto.html',
          controller: 'productoCtrl'
        }
      }
    })

    .state('app.configuracion', {
      url: '/configuracion',
      views: {
        'menuContent': {
          templateUrl: 'templates/Admin/configuracion.html',
          controller: 'configuracionCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/categorias');
});
