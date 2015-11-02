// STACK
var ud          = require('ud')
var vdom        = require('virtual-dom')
var h           = require('virtual-hyperscript-hook')(require('virtual-dom/h'))
var vraf        = require('virtual-raf')
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
        whiteblue   : 'hsla(189, 78% , 98% , 1   )',
        bluegrey    : 'hsla(208, 19% , 87% , 1   )',

        lightblue   : 'hsla(180, 43% , 79% , 1   )',
        otherorange : 'hsla(24 , 84% , 50% , 1   )',
        lightgrey   : 'hsla(0  , 0%  , 95% , 1   )',
        mediumgrey2 : 'hsla(213, 5%  , 62% , 1   )',
        mediumgrey  : 'hsla(210, 6%  , 58% , 1   )',
        darkgrey    : 'hsla(222, 5%  , 54% , 1   )',
        darkergrey  : 'hsla(210, 5%  , 29% , 1   )',

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
        red         : 'hsla(3  , 80% , 49% , 1   )',
        magenta     : 'hsla(350, 78% , 50% , 1   )',
        white       : 'hsla(255, 100%, 100%, 1   )',
        black       : 'hsla(0  , 0%  , 0%  , 1   )',
      },
      header    : {
        width       : '940'
      },
      font      : {
        avenirRoman   : 'Avenir Roman',
        avenirHeavy   : 'Avenir Heavy',
        avenirMedium  : 'Avenir Medium',
        avenirOblique : 'Avenir Oblique',
        small         : '15',
        bigsmall      : '18',
        medium        : '25',
        large         : '28',
        giant         : '34'
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
      socialmedia : {
        email       : {
          normal    : 'assets/socialmedia/footer_button_email.png',
          retina    : 'assets/socialmedia/footer_button_email@2x.png'
        },
        facebook    : {
          normal    : 'assets/socialmedia/footer_button_fb.png',
          retina    : 'assets/socialmedia/footer_button_fb@2x.png'
        },
        twitter     : {
          normal    : 'assets/socialmedia/footer_button_twitter.png',
          retina    : 'assets/socialmedia/footer_button_twitter@2x.png'
        },
        linkedin    : {
          normal    : 'assets/socialmedia/footer_button_linkedin.png',
          retina    : 'assets/socialmedia/footer_button_linkedin@2x.png'
        },
        xing        : {
          normal    : 'assets/socialmedia/footer_button_xing.png',
          retina    : 'assets/socialmedia/footer_button_xing@2x.png'
        },
        instagram   : {
          normal    : 'assets/socialmedia/footer_button_instagram.png',
          retina    : 'assets/socialmedia/footer_button_instagram@2x.png'
        }
      },
      logo      : {
        topbar    : {
          normal    : 'assets/logo/topbar_logo_small.png',
          retina    : 'assets/logo/topbar_logo_small@2x.png'
        },
        banner    : {
          normal    : 'assets/logo/logo_header.png',
          retina    : 'assets/logo/logo_header@2x.png'
        },
        solo      : {
          normal    : 'assets/logo/redlabR.svg',
          retina    : 'assets/logo/redlabR.svg'
        }
      },
      team      : [{
        normal: 'assets/team/team_bianca.png',
        retina: 'assets/team/team_bianca@2x.png'
      },{
        normal: 'assets/team/team_stefanie.png',
        retina: 'assets/team/team_stefanie@2x.png'
      },{
        normal: 'assets/team/team_christine.png',
        retina: 'assets/team/team_christine@2x.png'
      }],
      title     : 'the red lab',
      subtitle  : 'we enable growth',
      innovation  : {
        icon        : {
          normal      : 'assets/pictogram_innovation.png',
          retina      : 'assets/pictogram_innovation@2x.png'
        }
      },
      transform  : {
        icon        : {
          normal      : 'assets/pictogram_transformation.png',
          retina      : 'assets/pictogram_transformation@2x.png'
        }
      },
      leadership  : {
        icon        : {
          normal      : 'assets/pictogram_leadership.png',
          retina      : 'assets/pictogram_leadership@2x.png'
        }
      },
      page      : {
        home      : {
          slider    : {
            width     : '1200px',
            slides    : [{
              title     : 'we enable growth',
              normal    : 'assets/header_red_muster.jpg',
              retina    : 'assets/header_red_muster@2x.jpg'
            },{
              title     : 'Innovation',
              normal    : 'assets/header_blue_wolken.jpg',
              retina    : 'assets/header_blue_wolken@2x.jpg'
            },{
              title     : 'Transformation',
              normal    : 'assets/header_red_vögel_weiss.jpg',
              retina    : 'assets/header_red_vögel_weiss@2x.jpg'
            },{
              title     : 'Leadership',
              normal    : 'assets/header_orange_3.jpg',
              retina    : 'assets/header_orange_3@2x.jpg'
            }]
          }
        }
      },
      submenu   : [{
        link  : '/#products/innovation',
        name  : 'Innovation'
      },{
        link  : '/#products/transformation',
        name  : 'Transformation'
      },{
        link  : '/#products/digital-leadership',
        name  : 'Digital Leadership Program'
      },{
        link  : '/#products/female-leadership',
        name  : 'Female Leadership Experience'
      },{
        link  : '/#products/leadership-program',
        name  : 'Women in Leadership Program'
      }],
      counter   : 0
    }
  }
  s = styling(`
    @font-face {
      font-family : "${state.theme.font.avenirRoman}";
      src         : url(assets/font/AvenirRoman.otf);
    }
  `)
  s = styling(`
    @font-face {
      font-family : "${state.theme.font.avenirHeavy}";
      src         : url(assets/font/AvenirHeavy.otf);
    }
  `)
  s = styling(`
    @font-face {
      font-family : "${state.theme.font.avenirMedium}";
      src         : url(assets/font/AvenirLight.otf);
    }
  `)
  s = styling(`
    @font-face {
      font-family : "${state.theme.font.avenirOblique}";
      src         : url(assets/font/AvenirOblique.otf);
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
  var tree = vraf(STATE, RENDER, vdom)
  document.title = STATE.data.title
   // CSS RESET
  document.body.style.margin = 0
  document.body.style.backgroundColor = STATE.theme.colors.whiteblue
  // UPDATE DOM
  document.body.appendChild(tree())
  return tree
}, 'ENGINE')
