// STACK
var ud          = require('ud')
var vdom        = require('virtual-dom')
var h           = require('virtual-hyperscript-hook')(require('virtual-dom/h'))
var main        = require('main-loop')
var singlepage  = require('single-page-hash')
var catchlinks  = require('catch-links')

// CUSTOM
var styling     = require('_styling')
var ROUTER      = require('_router')
var s

var STATE = ud.defonce(module, function initialize (){

  var state = {
    /**************************************************************************
      UPDATE VIEW through NAVIGATION => shift perspective
    **************************************************************************/
    route     : {},
    /**************************************************************************
      UPDATE VIEW through ACTIONS => shift content
    **************************************************************************/
    action    : function action (name, state) {
      console.log('Action: ', name)
      ENGINE.update(state)
    },
    /**************************************************************************
      STYLE CUSTOMIZATION
    **************************************************************************/
    theme     : {
      colors    : {
        grey        : 'hsla(0  , 0%  , 69% , 1   )',
        cyangrey    : 'hsla(166, 36% , 79% , 1   )',
        cyantrans   : 'hsla(182, 42% , 68% , 0.6 )',
        lightcyan   : 'hsla(187, 47% , 76% , 1   )',
        cyanpure    : 'hsla(189, 52% , 70% , 1   )',
        cyandark    : 'hsla(180, 41% , 64% , 1   )',
        orange      : 'hsla(19 , 80% , 48% , 1   )',
        darkorange  : 'hsla(11 , 81% , 49% , 1   )',
        roselight   : 'hsla(358, 84% , 47% , 0.71)',
        rose        : 'hsla(0  , 78% , 56% , 1   )',
        red         : 'hsla(3  , 85% , 48% , 1   )',
        magenta     : 'hsla(350, 78% , 50% , 1   )',
        white       : 'hsla(255, 100%, 100%, 1   )',
        black       : 'hsla(0  , 0%  , 0%  , 1   )',
      },
      header    : {
        width       : '940'
      },
      font      : {
        hnul        : 'HelveticaNeue-Light',
        sizeA       : '15'
      }
    },
    /**************************************************************************
      UI STATE
    **************************************************************************/
    ui        : {},
    /**************************************************************************
      DATA STATE
    **************************************************************************/
    data      : {
      submenu   : [{
        link  : '/#products/learning-experience',
        name  : 'Innovation Experience'
      },{
        link  : '/#products/female-leadership',
        name  : 'Learning Journey'
      },{
        link  : '/#products/female-leadership',
        name  : 'Digital Leadership Program'
      },{
        link  : '/#products/female-leadership',
        name  : 'Female Leadership Experience'
      },{
        link  : '/#products/book',
        name  : 'Women in Leadership Program'
      }],
      counter   : 0
    }
  }
  s = s ? s : styling(`
    @font-face {
      font-family : "${state.theme.font.hnul}";
      src         : url(assets/${state.theme.font.hnul}.woff);
    }
  `)

  return state
}, 'STATE')

var router = ud.defobj(module, ROUTER(STATE))

/******************************************************************************
  RENDER PAGE
    HANDLE PAGE & STATE CHANGE
******************************************************************************/
var RENDER      = ud.defn(module, function render (state) {
  console.log('RENDER')
  var href = state.href || '/'
  state.route = router.match(href)
  // e.g. http://localhost:5000/:param1/:param2/*splat
  // STATE.route = {
  //   params  : { param1: '...', param2: '...' },
  //   splats  : ['*splat'],
  //   route   : '/',
  //   next    : function next () {}
  //   fn      : function routeHandler() {}
  // }
  return /*vtree*/ state.route ?
    (
      state.route['path'] = href,
      // SINGLE RESPONSIBILITY
      // I try to only pass in the information that a route directly needs,
      // since that keeps the code less coupled to my application.
      // => maybe let the ROUTE state what it needs instead
      // => if necessary, grant permissions to routes
      state.route.fn(state)
    ) : (
      h('div', [  // h('div', 'not found')
        h('h1', '404 - not found'),
        h('h3', 'clicked ' + state.data.counter + ' times'),
        h('button', { onclick: onclick }, 'click me!'),
        h('br'),
        h('a', { href: '/' }, 'go to the redlab'),
        h('a', { href: '/#a' }, 'go to the redlab/#test')
      ])
    )
    function onclick () {
      state.data.counter = state.data.counter+1
      state.action('plus', state)
    }
}, 'RENDER')

/****************************************************************************
  HOT MODULE RELOADING
****************************************************************************/
var id = setTimeout(function () {ENGINE.update(STATE)},0)

var ENGINE = ud.defonce(module, function () {
  /****************************************************************************
   UPDATE VIEW through LINK ROUTING
  ****************************************************************************/
  var INITIALIZED
  catchlinks(window, singlepage(function pagehandler (href) {
    if (INITIALIZED) {
      console.log('Navigate to: ', href)
      STATE.href = href
      ENGINE.update(STATE)
    } else {
      INITIALIZED = true
    }
  })) // js update: location.href = 'new url'
  console.log('INITIALIZE ENGINE')
  clearTimeout(id)
  var loop = main(STATE, RENDER, vdom)
  document.title = 'The Red Lab'
   // CSS RESET
  document.body.style.margin    = 0
  document.body.style.backgroundColor = '#fff'
  // UPDATE DOM
  document.body.appendChild(loop.target)
  return loop
}, 'ENGINE')
