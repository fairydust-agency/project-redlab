// STACK
var ud          = require('ud')
var vdom        = require('virtual-dom')
var h           = require('virtual-hyperscript-hook')(require('virtual-dom/h'))
var jss         = require('jss')
var css2jss     = require('jss-cli/lib/cssToJss')
var main        = require('main-loop')
var singlepage  = require('single-page-hash')
var catchlinks  = require('catch-links')

// CUSTOM
var ROUTER      = require('_router')

var STATE = ud.defonce(module, function initialize (){
  return {
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
        grey      : '#A4A8A9',
        lightcyan : '#85C0BE',
        darkcyan  : '#3D8C87',
        lightrose : '#CF5578',
        rose      : '#C32C59',
        white     : '#FFFFFF',
        darkrose  : '#962043',
        redrose   : '#E72849',
        orangerose: '#DD8770'
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
      counter   : 0,
      messages  : []
    }
  }
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
  document.body.style.margin = 0 // CSS RESET
  document.body.appendChild(loop.target)
  return loop
}, 'ENGINE')
