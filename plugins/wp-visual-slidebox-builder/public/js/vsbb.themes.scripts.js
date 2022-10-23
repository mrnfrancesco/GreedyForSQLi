/**
 * jquery.pfold.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

;(function ($, window, undefined) {

    'use strict';

    /*
     * debouncedresize: special jQuery event that happens once after a window resize
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */
    var $event = $.event,
        $special,
        resizeTimeout;

    $special = $event.special.debouncedresize = {
        setup: function () {
            $(this).on("resize", $special.handler);
        },
        teardown: function () {
            console.log('tear down ', $(this));
            $(this).off("resize", $special.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
                args = arguments,
                dispatch = function () {
                    // set correct event type
                    event.type = "debouncedresize";
                    $event.dispatch.apply(context, args);
                };

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            execAsap ?
                dispatch() :
                resizeTimeout = setTimeout(dispatch, $special.threshold);
        },
        threshold: 50
    };

    // global
    var $window = $(window),
        Modernizr = window.Modernizr;

    $.PFold = function (options, element) {

        this.$el = $(element);
        this._init(options);

    };

    // the options
    $.PFold.defaults = {
        // perspective value
        perspective: 1200,
        // each folding step's speed
        speed: 450,
        // each folding step's easing
        easing: 'linear',
        // delay between each (un)folding step (ms)
        folddelay: 0,
        // number of times the element will fold
        folds: 2,
        // the direction of each unfolding step
        folddirection: ['right', 'top'],
        // use overlays to simulate a shadow for each folding step
        overlays: true,
        // the main container moves (translation) in order to keep its initial position
        centered: false,
        // allows us to specify a different speed for the container's translation
        // values range : [0 - 1]
        // if 0 the container jumps immediately to the final position (translation).
        // this is only valid if centered is true
        containerSpeedFactor: 1,
        // easing for the container transition
        // this is only valid if centered is true
        containerEasing: 'linear',
        // callbacks
        onEndFolding: function () {
            return false;
        },
        onEndUnfolding: function () {
            return false;
        }
    };

    $.PFold.prototype = {

        _destroyPfold: function () {
            this._unbindEvents();
            this.$el.removeData();
            //this.$el.removeAttr('style');
            var $initialContentEl = this.$el.find('div.uc-initial-content').first();
            var $finalContentEl = this.$el.find('div.uc-final-content');
            this.$el.html('');
            this.$el.append($initialContentEl).append($finalContentEl);
        },
        _unbindEvents: function () {
            $window.off('debouncedresize.pfold');
        },
        _init: function (options) {

            // options
            this.options = $.extend(true, {}, $.PFold.defaults, options);

            // https://github.com/twitter/bootstrap/issues/2870
            this.transEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            };
            this.transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];

            // suport for css 3d transforms and css transitions
            this.support = Modernizr.csstransitions && Modernizr.csstransforms3d;

            // apply perspective to the main container
            if (this.support) {

                this.$el.css('perspective', this.options.perspective + 'px');

                // set the transition to the main container
                // we will need to move it if:
                // this.options.centered is true;
                // the opened element goes outside of the viewport
                this.$el.css('transition', 'all ' + ( this.options.speed * this.options.folds * this.options.containerSpeedFactor ) + 'ms ' + this.options.containerEasing);

            }

            // initial sizes
            this.initialDim = {
                width: this.$el.width(),
                height: this.$el.height(),
                left: 0,
                top: 0
            };

            // change the layout
            this._layout();

            // cache some initial values:
            // initial content
            this.$iContent = this.$el.find('.uc-initial');
            this.iContent = this.$iContent.html();
            // final content
            this.$fContent = this.$el.find('.uc-final');
            this.fContent = this.$fContent.html();
            // this element is inserted in the main container and it will contain the initial and final content elements
            this.$finalEl = $('<div class="uc-final-wrapper"></div>').append(this.$iContent.clone().hide(), this.$fContent).hide();
            this.$el.append(this.$finalEl);

            // initial element's offset
            this._setDimOffset();

            // status
            this.opened = false;
            this.animating = false;

            // initialize events
            this._initEvents();

        },

        _updateDims: function () {
            this.initialDim = {
                width: this.$el.width(),
                height: this.$el.height(),
                left: 0,
                top: 0
            };
            // change the layout
            this._layout();

            // initial content
            this.fContent = this.$fContent.html();

            // initial element's offset
            this._setDimOffset();

            // status
            this.opened = false;
            this.animating = false;

            // initialize events
            this._initEvents();
        },

        // changes the initial html structure
        // adds wrappers to the uc-initial-content and uc-final-content divs
        _layout: function () {

            var $initialContentEl = this.$el.children('div.uc-initial-content'),
                finalDim = this._getFinalDim(),
                $finalContentEl = this.$el.children('div.uc-final-content').css({
                    width: finalDim.width,
                    height: finalDim.height
                });

            $initialContentEl.wrap('<div class="uc-initial"></div>');
            $finalContentEl.show().wrap($('<div class="uc-final"></div>'));

        },
        // initialize the necessary events
        _initEvents: function () {

            var self = this;

            $window.on('debouncedresize.pfold', function (event) {

                // update offsets
                self._setDimOffset();

            });

        },
        // set/update offsets
        _setDimOffset: function () {

            this.initialDim.offsetL = this.$el.offset().left - $window.scrollLeft();
            this.initialDim.offsetT = this.$el.offset().top - $window.scrollTop();
            this.initialDim.offsetR = $window.width() - this.initialDim.offsetL - this.initialDim.width;
            this.initialDim.offsetB = $window.height() - this.initialDim.offsetT - this.initialDim.height;

        },
        // gets the values needed to translate the main container (if options.centered is true)
        _getTranslationValue: function () {

            var x = 0,
                y = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :

                        x += this.initialDim.width * Math.pow(2, horizTimes) / 2;
                        horizTimes += 1;
                        break;

                    case 'right' :

                        x -= this.initialDim.width * Math.pow(2, horizTimes) / 2;
                        horizTimes += 1;
                        break;

                    case 'top' :

                        y += this.initialDim.height * Math.pow(2, vertTimes) / 2;
                        vertTimes += 1;
                        break;

                    case 'bottom' :

                        y -= this.initialDim.height * Math.pow(2, vertTimes) / 2;
                        vertTimes += 1;
                        break;

                }

            }

            return {
                x: x,
                y: y
            };

        },
        // gets the accumulated values for left, right, top and bottom once the element is opened
        _getAccumulatedValue: function () {

            var l = 0,
                r = 0,
                t = 0,
                b = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :

                        l += this.initialDim.width * Math.pow(2, horizTimes);
                        horizTimes += 1;
                        break;

                    case 'right' :

                        r += this.initialDim.width * Math.pow(2, horizTimes);
                        horizTimes += 1;
                        break;

                    case 'top' :

                        t += this.initialDim.height * Math.pow(2, vertTimes);
                        vertTimes += 1;
                        break;

                    case 'bottom' :

                        b += this.initialDim.height * Math.pow(2, vertTimes);
                        vertTimes += 1;
                        break;

                }

            }

            return {
                l: l,
                r: r,
                t: t,
                b: b
            };

        },
        // gets the width and height of the element when it is opened
        _getFinalDim: function () {

            var l = 0,
                r = 0,
                t = 0,
                b = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :
                    case 'right' :

                        horizTimes += 1;
                        break;

                    case 'top' :
                    case 'bottom' :

                        vertTimes += 1;
                        break;

                }

            }

            return {
                width: this.initialDim.width * Math.pow(2, horizTimes),
                height: this.initialDim.height * Math.pow(2, vertTimes)
            };

        },
        // returns the sizes and positions for the element after each (un)folding step
        _updateStepStyle: function (action) {

            var w, h, l, t;

            if (action === 'fold') {

                w = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.width / 2 : this.lastStyle.width,
                    h = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.height : this.lastStyle.height / 2,
                    l = this.lastDirection === 'left' ? this.lastStyle.left + this.lastStyle.width / 2 : this.lastStyle.left,
                    t = this.lastDirection === 'top' ? this.lastStyle.top + this.lastStyle.height / 2 : this.lastStyle.top;

            }
            else {

                w = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.width * 2 : this.lastStyle.width,
                    h = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.height : this.lastStyle.height * 2,
                    l = this.lastDirection === 'left' ? this.lastStyle.left - this.lastStyle.width : this.lastStyle.left,
                    t = this.lastDirection === 'top' ? this.lastStyle.top - this.lastStyle.height : this.lastStyle.top;

            }

            return {
                width: w,
                height: h,
                left: l,
                top: t
            };

        },
        // get the opposite direction
        _getOppositeDirection: function (realdirection) {

            var rvd;

            switch (realdirection) {

                case 'left' :
                    rvd = 'right';
                    break;
                case 'right' :
                    rvd = 'left';
                    break;
                case 'top' :
                    rvd = 'bottom';
                    break;
                case 'bottom' :
                    rvd = 'top';
                    break;

            }

            return rvd;

        },
        // main function: unfolds and folds the element [options.folds] times by using recursive calls
        _start: function (action, step) {

            // Basically we are replacing the element's content with 2 divisions, the top and bottom elements.
            // The top element will have a front and back faces. The front has the initial content for the first step
            // and the back will have the final content for the last step. For all the other cases the top element will be blank.
            // The bottom element will have the final content for the last step and will be blank for all the other cases.
            // We need to keep the right sizes and positions for these 2 elements, so we need to cache the previous step's state.

            step |= 0;

            var self = this,
                styleCSS = ( action === 'fold' ) ? {
                    width: this.lastStyle.width,
                    height: this.lastStyle.height,
                    left: this.lastStyle.left,
                    top: this.lastStyle.top
                } : this.initialDim,
                contentTopFront = '', contentBottom = '', contentTopBack = '',
                // direction for step [step]
                // bottom is the default value if none is present
                direction = ( action === 'fold' ) ?
                    this.options.folddirection[this.options.folds - 1 - step] || 'bottom' :
                    this.options.folddirection[step] || 'bottom',
                // future direction value (only for the "fold" action)
                nextdirection = ( action === 'fold' ) ? this.options.folddirection[this.options.folds - 2 - step] || 'bottom' : '';

            // remove uc-part divs inside the container (the top and bottom elements)
            this.$el.find('div.uc-part').remove();

            switch (step) {

                // first step & last transition step
                case 0 :
                case this.options.folds - 1 :

                    if (action === 'fold') {

                        if (step === this.options.folds - 1) {

                            styleCSS = this.initialDim;
                            contentTopFront = this.iContent;

                        }

                        if (step === 0) {

                            this._setDimOffset();

                            // reset the translation of the main container
                            this.$el.css({left: 0, top: 0});

                            var content = this._setLastStep(direction, styleCSS),
                                contentBottom = content.bottom,
                                contentTopBack = content.top;

                            this.$finalEl.hide().children().hide();

                        }

                    }
                    else { // unfolding

                        if (step === 0) {

                            this._setDimOffset();

                            // if options.centered is true, we need to center the container.
                            // either ways we need to make sure the container does not move outside the viewport.
                            // let's get the correct translation values for the container's transition
                            var coords = this._getTranslationViewport();

                            this.$el.addClass('uc-current').css({left: coords.ftx, top: coords.fty});

                            contentTopFront = this.iContent;

                            this.$finalEl.hide().children().hide();

                        }
                        else {

                            styleCSS = this._updateStepStyle(action);

                        }

                        if (step === this.options.folds - 1) {

                            var content = this._setLastStep(direction, styleCSS),
                                contentBottom = content.bottom,
                                contentTopBack = content.top;

                        }

                    }

                    break;

                // last step is to replace the topElement and bottomElement with a division that has the final content
                case this.options.folds :

                    styleCSS = ( action === 'fold') ? this.initialDim : this._updateStepStyle(action);

                    // remove top and bottom elements
                    var contentIdx = ( action === 'fold' ) ? 0 : 1;
                    this.$el
                        .find('.uc-part')
                        .remove();

                    this.$finalEl.css(styleCSS).show().children().eq(contentIdx).show();

                    this.opened = ( action === 'fold' ) ? false : true;
                    this.animating = false;
                    // nothing else to do
                    if (action === 'fold') {

                        this.$el.removeClass('uc-current');
                        this.options.onEndFolding();

                    }
                    else {

                        this.options.onEndUnfolding();

                    }
                    return false;

                    break;

                // all the other steps
                default :

                    // style of new layout will depend on the last step direction
                    styleCSS = this._updateStepStyle(action);

                    break;

            }

            // transition properties for the step
            if (this.support) {

                styleCSS.transition = 'all ' + this.options.speed + 'ms ' + this.options.easing;

            }

            var unfoldClass = 'uc-unfold-' + direction,
                topElClasses = ( action === 'fold' ) ? 'uc-unfold uc-part ' + unfoldClass : 'uc-part ' + unfoldClass,
                $topEl = $('<div class="' + topElClasses + '"><div class="uc-front">' + contentTopFront + '</div><div class="uc-back">' + contentTopBack + '</div></div>').css(styleCSS),
                $bottomEl = $('<div class="uc-part uc-single">' + contentBottom + '</div>').css(styleCSS);

            // cache last direction and style
            this.lastDirection = ( action === 'fold' ) ? nextdirection : direction;
            this.lastStyle = styleCSS;

            // append new elements
            this.$el.append($bottomEl, $topEl);

            // add overlays
            if (this.options.overlays && this.support) {

                this._addOverlays(action, $bottomEl, $topEl);

            }

            setTimeout(function () {

                // apply style
                ( action === 'fold' ) ? $topEl.removeClass('uc-unfold') : $topEl.addClass('uc-unfold');

                if (self.support) {

                    $topEl.on(self.transEndEventName, function (event) {

                        if (event.target.className !== 'uc-flipoverlay' && step < self.options.folds) {

                            // goto next step in [options.folddelay] ms
                            setTimeout(function () {
                                self._start(action, step + 1);
                            }, self.options.folddelay);

                        }

                    });

                }
                else {

                    // goto next step
                    self._start(action, step + 1);

                }

                if (self.options.overlays && self.support) {

                    var bo = ( action === 'fold' ) ? 1 : 0,
                        tbo = ( action === 'fold' ) ? .5 : 0,
                        tfo = ( action === 'fold' ) ? 0 : .5;

                    self.$bottomOverlay.css('opacity', bo);
                    self.$topBackOverlay.css('opacity', tbo);
                    self.$topFrontOverlay.css('opacity', tfo);

                }

            }, 30);

        },
        // gets the translation values for the container's transition
        _getTranslationViewport: function () {

            // the accumulatedValues stores the left, right, top and bottom increments to the final/opened element relatively to the initial/closed element
            var accumulatedValues = this._getAccumulatedValue(),
                tx = 0,
                ty = 0;

            // the final offsets for the opened element
            this.fOffsetL = this.initialDim.offsetL - accumulatedValues.l;
            this.fOffsetT = this.initialDim.offsetT - accumulatedValues.t;
            this.fOffsetR = this.initialDim.offsetR - accumulatedValues.r;
            this.fOffsetB = this.initialDim.offsetB - accumulatedValues.b;

            if (this.fOffsetL < 0) {
                tx = Math.abs(this.fOffsetL);
            }
            if (this.fOffsetT < 0) {
                ty = Math.abs(this.fOffsetT);
            }
            if (this.fOffsetR < 0) {
                tx -= Math.abs(this.fOffsetR);
            }
            if (this.fOffsetB < 0) {
                ty -= Math.abs(this.fOffsetB);
            }

            // final translation values
            var ftx = tx,
                fty = ty;

            if (this.options.centered) {

                var translationValue = this._getTranslationValue();

                if (translationValue.x > 0 && this.fOffsetR + translationValue.x >= 0) {

                    ftx = ( this.fOffsetL >= 0 ) ? Math.min(translationValue.x, this.fOffsetR) : translationValue.x + ( tx - translationValue.x );

                }
                else if (translationValue.x < 0 && this.fOffsetL + translationValue.x >= 0) {

                    ftx = ( this.fOffsetR >= 0 ) ? Math.min(translationValue.x, this.fOffsetL) : translationValue.x + ( tx - translationValue.x );

                }
                else {

                    ftx = translationValue.x + ( tx - translationValue.x );

                }

                if (translationValue.y > 0 && this.fOffsetB + translationValue.y >= 0) {

                    fty = ( this.fOffsetT >= 0 ) ? Math.min(translationValue.y, this.fOffsetB) : translationValue.y + ( ty - translationValue.y );

                }
                else if (translationValue.y < 0 && this.fOffsetT + translationValue.y >= 0) {

                    fty = ( this.fOffsetB >= 0 ) ? Math.min(translationValue.y, this.fOffsetT) : translationValue.y + ( ty - translationValue.y );

                }
                else {

                    fty = translationValue.y + ( ty - translationValue.y );

                }

            }

            return {
                ftx: ftx,
                fty: fty
            };

        },
        // sets the last step's content
        _setLastStep: function (direction, styleCSS) {

            var contentBottom, contentTopBack,
                contentBottomStyle = '',
                contentTopBackStyle = '';

            switch (direction) {

                case 'bottom' :
                    contentTopBackStyle = 'margin-top: -' + styleCSS.height + 'px';
                    break;
                case 'top' :
                    contentBottomStyle = 'margin-top: -' + styleCSS.height + 'px';
                    break;
                case 'left' :
                    contentTopBackStyle = 'width:' + ( styleCSS.width * 2 ) + 'px';
                    contentBottomStyle = 'width:' + ( styleCSS.width * 2 ) + 'px;margin-left: -' + styleCSS.width + 'px';
                    break;
                case 'right' :
                    contentTopBackStyle = 'with:' + ( styleCSS.width * 2 ) + 'px;margin-left: -' + styleCSS.width + 'px';
                    contentBottomStyle = 'width:' + ( styleCSS.width * 2 ) + 'px';
                    break;

            }

            contentBottom = '<div class="uc-inner"><div class="uc-inner-content" style="' + contentBottomStyle + '">' + this.fContent + '</div></div>';

            var contentTopBackClasses = direction === 'top' || direction === 'bottom' ? 'uc-inner uc-inner-rotate' : 'uc-inner';
            contentTopBack = '<div class="' + contentTopBackClasses + '"><div class="uc-inner-content" style="' + contentTopBackStyle + '">' + this.fContent + '</div></div>';

            return {
                bottom: contentBottom,
                top: contentTopBack
            };

        },
        // adds overlays to the "(un)folding" elements if the options.overlays is true
        _addOverlays: function (action, $bottomEl, $topEl) {

            var bottomOverlayStyle, topFrontOverlayStyle, topBackOverlayStyle;

            this.$bottomOverlay = $('<div class="uc-overlay"></div>');
            this.$topFrontOverlay = $('<div class="uc-flipoverlay"></div>');
            this.$topBackOverlay = $('<div class="uc-flipoverlay"></div>');

            if (action === 'fold') {

                bottomOverlayStyle = {
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing + ' ' + ( this.options.speed / 2 ) + 'ms'
                };

                topFrontOverlayStyle = {
                    opacity: .5,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topBackOverlayStyle = {
                    opacity: 0,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

            }
            else {

                bottomOverlayStyle = {
                    opacity: 1,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topFrontOverlayStyle = {
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topBackOverlayStyle = {
                    opacity: .5,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing + ' ' + ( this.options.speed / 2 ) + 'ms'
                };

            }

            $bottomEl.append(this.$bottomOverlay.css(bottomOverlayStyle));
            $topEl.children('div.uc-front')
                .append(this.$topFrontOverlay.css(topFrontOverlayStyle))
                .end()
                .children('div.uc-back')
                .append(this.$topBackOverlay.css(topBackOverlayStyle));

        },
        // public method: unfolds the element
        unfold: function () {

            // if opened already or currently (un)folding return
            if (this.opened || this.animating) {

                return false;

            }

            this.animating = true;
            this._start('unfold');

        },
        // public method: folds the element
        fold: function () {

            // if not opened or currently (un)folding return
            if (!this.opened || this.animating) {

                return false;

            }

            this.animating = true;
            this._start('fold');

        },
        // public method: returns 'opened' or 'closed'
        getStatus: function () {

            return ( this.opened ) ? 'opened' : 'closed';

        }

    };

    var logError = function (message) {

        if (window.console) {

            window.console.error(message);

        }

    };

    $.fn.pfold = function (options) {

        var instance = $.data(this, 'pfold');
        console.log('instance ', instance);

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {

                if (!instance) {

                    logError("cannot call methods on pfold prior to initialization; " +
                        "attempted to call method '" + options + "'");
                    return;

                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {

                    logError("no such method '" + options + "' for pfold instance");
                    return;

                }

                instance[options].apply(instance, args);

            });

        }
        else {
            this.each(function () {

                console.log('instance 2', instance);
                if (instance) {

                    instance._init();

                }
                else {

                    instance = $.data(this, 'pfold', new $.PFold(options, this));

                }

            });

        }
        console.log('instance ', instance);

        return instance;

    };

})(jQuery, window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb2xkaW5nL2pzL2pxdWVyeS5wZm9sZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGpxdWVyeS5wZm9sZC5qcyB2MS4wLjBcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICpcbiAqIENvcHlyaWdodCAyMDEyLCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCB1bmRlZmluZWQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qXG4gICAgICogZGVib3VuY2VkcmVzaXplOiBzcGVjaWFsIGpRdWVyeSBldmVudCB0aGF0IGhhcHBlbnMgb25jZSBhZnRlciBhIHdpbmRvdyByZXNpemVcbiAgICAgKlxuICAgICAqIGxhdGVzdCB2ZXJzaW9uIGFuZCBjb21wbGV0ZSBSRUFETUUgYXZhaWxhYmxlIG9uIEdpdGh1YjpcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbG91aXNyZW1pL2pxdWVyeS1zbWFydHJlc2l6ZS9ibG9iL21hc3Rlci9qcXVlcnkuZGVib3VuY2VkcmVzaXplLmpzXG4gICAgICpcbiAgICAgKiBDb3B5cmlnaHQgMjAxMSBAbG91aXNfcmVtaVxuICAgICAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAgICAgKi9cbiAgICB2YXIgJGV2ZW50ID0gJC5ldmVudCxcbiAgICAgICAgJHNwZWNpYWwsXG4gICAgICAgIHJlc2l6ZVRpbWVvdXQ7XG5cbiAgICAkc3BlY2lhbCA9ICRldmVudC5zcGVjaWFsLmRlYm91bmNlZHJlc2l6ZSA9IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykub24oXCJyZXNpemVcIiwgJHNwZWNpYWwuaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGVhciBkb3duICcsICQodGhpcykpO1xuICAgICAgICAgICAgJCh0aGlzKS5vZmYoXCJyZXNpemVcIiwgJHNwZWNpYWwuaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCwgZXhlY0FzYXApIHtcbiAgICAgICAgICAgIC8vIFNhdmUgdGhlIGNvbnRleHRcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgY29ycmVjdCBldmVudCB0eXBlXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBcImRlYm91bmNlZHJlc2l6ZVwiO1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQuZGlzcGF0Y2guYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJlc2l6ZVRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4ZWNBc2FwID9cbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgpIDpcbiAgICAgICAgICAgICAgICByZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dChkaXNwYXRjaCwgJHNwZWNpYWwudGhyZXNob2xkKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGhyZXNob2xkOiA1MFxuICAgIH07XG5cbiAgICAvLyBnbG9iYWxcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgTW9kZXJuaXpyID0gd2luZG93Lk1vZGVybml6cjtcblxuICAgICQuUEZvbGQgPSBmdW5jdGlvbiAob3B0aW9ucywgZWxlbWVudCkge1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbGVtZW50KTtcbiAgICAgICAgdGhpcy5faW5pdChvcHRpb25zKTtcblxuICAgIH07XG5cbiAgICAvLyB0aGUgb3B0aW9uc1xuICAgICQuUEZvbGQuZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHBlcnNwZWN0aXZlIHZhbHVlXG4gICAgICAgIHBlcnNwZWN0aXZlOiAxMjAwLFxuICAgICAgICAvLyBlYWNoIGZvbGRpbmcgc3RlcCdzIHNwZWVkXG4gICAgICAgIHNwZWVkOiA0NTAsXG4gICAgICAgIC8vIGVhY2ggZm9sZGluZyBzdGVwJ3MgZWFzaW5nXG4gICAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICAgIC8vIGRlbGF5IGJldHdlZW4gZWFjaCAodW4pZm9sZGluZyBzdGVwIChtcylcbiAgICAgICAgZm9sZGRlbGF5OiAwLFxuICAgICAgICAvLyBudW1iZXIgb2YgdGltZXMgdGhlIGVsZW1lbnQgd2lsbCBmb2xkXG4gICAgICAgIGZvbGRzOiAyLFxuICAgICAgICAvLyB0aGUgZGlyZWN0aW9uIG9mIGVhY2ggdW5mb2xkaW5nIHN0ZXBcbiAgICAgICAgZm9sZGRpcmVjdGlvbjogWydyaWdodCcsICd0b3AnXSxcbiAgICAgICAgLy8gdXNlIG92ZXJsYXlzIHRvIHNpbXVsYXRlIGEgc2hhZG93IGZvciBlYWNoIGZvbGRpbmcgc3RlcFxuICAgICAgICBvdmVybGF5czogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIG1haW4gY29udGFpbmVyIG1vdmVzICh0cmFuc2xhdGlvbikgaW4gb3JkZXIgdG8ga2VlcCBpdHMgaW5pdGlhbCBwb3NpdGlvblxuICAgICAgICBjZW50ZXJlZDogZmFsc2UsXG4gICAgICAgIC8vIGFsbG93cyB1cyB0byBzcGVjaWZ5IGEgZGlmZmVyZW50IHNwZWVkIGZvciB0aGUgY29udGFpbmVyJ3MgdHJhbnNsYXRpb25cbiAgICAgICAgLy8gdmFsdWVzIHJhbmdlIDogWzAgLSAxXVxuICAgICAgICAvLyBpZiAwIHRoZSBjb250YWluZXIganVtcHMgaW1tZWRpYXRlbHkgdG8gdGhlIGZpbmFsIHBvc2l0aW9uICh0cmFuc2xhdGlvbikuXG4gICAgICAgIC8vIHRoaXMgaXMgb25seSB2YWxpZCBpZiBjZW50ZXJlZCBpcyB0cnVlXG4gICAgICAgIGNvbnRhaW5lclNwZWVkRmFjdG9yOiAxLFxuICAgICAgICAvLyBlYXNpbmcgZm9yIHRoZSBjb250YWluZXIgdHJhbnNpdGlvblxuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgdmFsaWQgaWYgY2VudGVyZWQgaXMgdHJ1ZVxuICAgICAgICBjb250YWluZXJFYXNpbmc6ICdsaW5lYXInLFxuICAgICAgICAvLyBjYWxsYmFja3NcbiAgICAgICAgb25FbmRGb2xkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRW5kVW5mb2xkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJC5QRm9sZC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgX2Rlc3Ryb3lQZm9sZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fdW5iaW5kRXZlbnRzKCk7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVEYXRhKCk7XG4gICAgICAgICAgICAvL3RoaXMuJGVsLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICAgICAgICB2YXIgJGluaXRpYWxDb250ZW50RWwgPSB0aGlzLiRlbC5maW5kKCdkaXYudWMtaW5pdGlhbC1jb250ZW50JykuZmlyc3QoKTtcbiAgICAgICAgICAgIHZhciAkZmluYWxDb250ZW50RWwgPSB0aGlzLiRlbC5maW5kKCdkaXYudWMtZmluYWwtY29udGVudCcpO1xuICAgICAgICAgICAgdGhpcy4kZWwuaHRtbCgnJyk7XG4gICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJGluaXRpYWxDb250ZW50RWwpLmFwcGVuZCgkZmluYWxDb250ZW50RWwpO1xuICAgICAgICB9LFxuICAgICAgICBfdW5iaW5kRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkd2luZG93Lm9mZignZGVib3VuY2VkcmVzaXplLnBmb2xkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIF9pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgICAgICAgICAvLyBvcHRpb25zXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgJC5QRm9sZC5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL2Jvb3RzdHJhcC9pc3N1ZXMvMjg3MFxuICAgICAgICAgICAgdGhpcy50cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgJ01velRyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgJ09UcmFuc2l0aW9uJzogJ29UcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAnbXNUcmFuc2l0aW9uJzogJ01TVHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnRyYW5zRW5kRXZlbnROYW1lID0gdGhpcy50cmFuc0VuZEV2ZW50TmFtZXNbTW9kZXJuaXpyLnByZWZpeGVkKCd0cmFuc2l0aW9uJyldO1xuXG4gICAgICAgICAgICAvLyBzdXBvcnQgZm9yIGNzcyAzZCB0cmFuc2Zvcm1zIGFuZCBjc3MgdHJhbnNpdGlvbnNcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydCA9IE1vZGVybml6ci5jc3N0cmFuc2l0aW9ucyAmJiBNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkO1xuXG4gICAgICAgICAgICAvLyBhcHBseSBwZXJzcGVjdGl2ZSB0byB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cHBvcnQpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmNzcygncGVyc3BlY3RpdmUnLCB0aGlzLm9wdGlvbnMucGVyc3BlY3RpdmUgKyAncHgnKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgdHJhbnNpdGlvbiB0byB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgICAgICAgICAvLyB3ZSB3aWxsIG5lZWQgdG8gbW92ZSBpdCBpZjpcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm9wdGlvbnMuY2VudGVyZWQgaXMgdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB0aGUgb3BlbmVkIGVsZW1lbnQgZ29lcyBvdXRzaWRlIG9mIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmNzcygndHJhbnNpdGlvbicsICdhbGwgJyArICggdGhpcy5vcHRpb25zLnNwZWVkICogdGhpcy5vcHRpb25zLmZvbGRzICogdGhpcy5vcHRpb25zLmNvbnRhaW5lclNwZWVkRmFjdG9yICkgKyAnbXMgJyArIHRoaXMub3B0aW9ucy5jb250YWluZXJFYXNpbmcpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGluaXRpYWwgc2l6ZXNcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpbSA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy4kZWwud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsLmhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBjaGFuZ2UgdGhlIGxheW91dFxuICAgICAgICAgICAgdGhpcy5fbGF5b3V0KCk7XG5cbiAgICAgICAgICAgIC8vIGNhY2hlIHNvbWUgaW5pdGlhbCB2YWx1ZXM6XG4gICAgICAgICAgICAvLyBpbml0aWFsIGNvbnRlbnRcbiAgICAgICAgICAgIHRoaXMuJGlDb250ZW50ID0gdGhpcy4kZWwuZmluZCgnLnVjLWluaXRpYWwnKTtcbiAgICAgICAgICAgIHRoaXMuaUNvbnRlbnQgPSB0aGlzLiRpQ29udGVudC5odG1sKCk7XG4gICAgICAgICAgICAvLyBmaW5hbCBjb250ZW50XG4gICAgICAgICAgICB0aGlzLiRmQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy51Yy1maW5hbCcpO1xuICAgICAgICAgICAgdGhpcy5mQ29udGVudCA9IHRoaXMuJGZDb250ZW50Lmh0bWwoKTtcbiAgICAgICAgICAgIC8vIHRoaXMgZWxlbWVudCBpcyBpbnNlcnRlZCBpbiB0aGUgbWFpbiBjb250YWluZXIgYW5kIGl0IHdpbGwgY29udGFpbiB0aGUgaW5pdGlhbCBhbmQgZmluYWwgY29udGVudCBlbGVtZW50c1xuICAgICAgICAgICAgdGhpcy4kZmluYWxFbCA9ICQoJzxkaXYgY2xhc3M9XCJ1Yy1maW5hbC13cmFwcGVyXCI+PC9kaXY+JykuYXBwZW5kKHRoaXMuJGlDb250ZW50LmNsb25lKCkuaGlkZSgpLCB0aGlzLiRmQ29udGVudCkuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKHRoaXMuJGZpbmFsRWwpO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsIGVsZW1lbnQncyBvZmZzZXRcbiAgICAgICAgICAgIHRoaXMuX3NldERpbU9mZnNldCgpO1xuXG4gICAgICAgICAgICAvLyBzdGF0dXNcbiAgICAgICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIGV2ZW50c1xuICAgICAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3VwZGF0ZURpbXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpbSA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy4kZWwud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsLmhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSBsYXlvdXRcbiAgICAgICAgICAgIHRoaXMuX2xheW91dCgpO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsIGNvbnRlbnRcbiAgICAgICAgICAgIHRoaXMuZkNvbnRlbnQgPSB0aGlzLiRmQ29udGVudC5odG1sKCk7XG5cbiAgICAgICAgICAgIC8vIGluaXRpYWwgZWxlbWVudCdzIG9mZnNldFxuICAgICAgICAgICAgdGhpcy5fc2V0RGltT2Zmc2V0KCk7XG5cbiAgICAgICAgICAgIC8vIHN0YXR1c1xuICAgICAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIGluaXRpYWxpemUgZXZlbnRzXG4gICAgICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hhbmdlcyB0aGUgaW5pdGlhbCBodG1sIHN0cnVjdHVyZVxuICAgICAgICAvLyBhZGRzIHdyYXBwZXJzIHRvIHRoZSB1Yy1pbml0aWFsLWNvbnRlbnQgYW5kIHVjLWZpbmFsLWNvbnRlbnQgZGl2c1xuICAgICAgICBfbGF5b3V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciAkaW5pdGlhbENvbnRlbnRFbCA9IHRoaXMuJGVsLmNoaWxkcmVuKCdkaXYudWMtaW5pdGlhbC1jb250ZW50JyksXG4gICAgICAgICAgICAgICAgZmluYWxEaW0gPSB0aGlzLl9nZXRGaW5hbERpbSgpLFxuICAgICAgICAgICAgICAgICRmaW5hbENvbnRlbnRFbCA9IHRoaXMuJGVsLmNoaWxkcmVuKCdkaXYudWMtZmluYWwtY29udGVudCcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmaW5hbERpbS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBmaW5hbERpbS5oZWlnaHRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGluaXRpYWxDb250ZW50RWwud3JhcCgnPGRpdiBjbGFzcz1cInVjLWluaXRpYWxcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICRmaW5hbENvbnRlbnRFbC5zaG93KCkud3JhcCgkKCc8ZGl2IGNsYXNzPVwidWMtZmluYWxcIj48L2Rpdj4nKSk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgbmVjZXNzYXJ5IGV2ZW50c1xuICAgICAgICBfaW5pdEV2ZW50czogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICR3aW5kb3cub24oJ2RlYm91bmNlZHJlc2l6ZS5wZm9sZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIG9mZnNldHNcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXREaW1PZmZzZXQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2V0L3VwZGF0ZSBvZmZzZXRzXG4gICAgICAgIF9zZXREaW1PZmZzZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdGhpcy5pbml0aWFsRGltLm9mZnNldEwgPSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0IC0gJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxEaW0ub2Zmc2V0VCA9IHRoaXMuJGVsLm9mZnNldCgpLnRvcCAtICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxEaW0ub2Zmc2V0UiA9ICR3aW5kb3cud2lkdGgoKSAtIHRoaXMuaW5pdGlhbERpbS5vZmZzZXRMIC0gdGhpcy5pbml0aWFsRGltLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsRGltLm9mZnNldEIgPSAkd2luZG93LmhlaWdodCgpIC0gdGhpcy5pbml0aWFsRGltLm9mZnNldFQgLSB0aGlzLmluaXRpYWxEaW0uaGVpZ2h0O1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldHMgdGhlIHZhbHVlcyBuZWVkZWQgdG8gdHJhbnNsYXRlIHRoZSBtYWluIGNvbnRhaW5lciAoaWYgb3B0aW9ucy5jZW50ZXJlZCBpcyB0cnVlKVxuICAgICAgICBfZ2V0VHJhbnNsYXRpb25WYWx1ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgeCA9IDAsXG4gICAgICAgICAgICAgICAgeSA9IDAsXG4gICAgICAgICAgICAgICAgaG9yaXpUaW1lcyA9IDAsXG4gICAgICAgICAgICAgICAgdmVydFRpbWVzID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMuZm9sZHM7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGFzIGRlZmF1bHRcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25baV0gfHwgJ2JvdHRvbSc7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcikge1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgeCArPSB0aGlzLmluaXRpYWxEaW0ud2lkdGggKiBNYXRoLnBvdygyLCBob3JpelRpbWVzKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBob3JpelRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCcgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB4IC09IHRoaXMuaW5pdGlhbERpbS53aWR0aCAqIE1hdGgucG93KDIsIGhvcml6VGltZXMpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCcgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB5ICs9IHRoaXMuaW5pdGlhbERpbS5oZWlnaHQgKiBNYXRoLnBvdygyLCB2ZXJ0VGltZXMpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHkgLT0gdGhpcy5pbml0aWFsRGltLmhlaWdodCAqIE1hdGgucG93KDIsIHZlcnRUaW1lcykgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydFRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXRzIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZXMgZm9yIGxlZnQsIHJpZ2h0LCB0b3AgYW5kIGJvdHRvbSBvbmNlIHRoZSBlbGVtZW50IGlzIG9wZW5lZFxuICAgICAgICBfZ2V0QWNjdW11bGF0ZWRWYWx1ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgbCA9IDAsXG4gICAgICAgICAgICAgICAgciA9IDAsXG4gICAgICAgICAgICAgICAgdCA9IDAsXG4gICAgICAgICAgICAgICAgYiA9IDAsXG4gICAgICAgICAgICAgICAgaG9yaXpUaW1lcyA9IDAsXG4gICAgICAgICAgICAgICAgdmVydFRpbWVzID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMuZm9sZHM7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGFzIGRlZmF1bHRcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25baV0gfHwgJ2JvdHRvbSc7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcikge1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgbCArPSB0aGlzLmluaXRpYWxEaW0ud2lkdGggKiBNYXRoLnBvdygyLCBob3JpelRpbWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHIgKz0gdGhpcy5pbml0aWFsRGltLndpZHRoICogTWF0aC5wb3coMiwgaG9yaXpUaW1lcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBob3JpelRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0b3AnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgdCArPSB0aGlzLmluaXRpYWxEaW0uaGVpZ2h0ICogTWF0aC5wb3coMiwgdmVydFRpbWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGIgKz0gdGhpcy5pbml0aWFsRGltLmhlaWdodCAqIE1hdGgucG93KDIsIHZlcnRUaW1lcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbDogbCxcbiAgICAgICAgICAgICAgICByOiByLFxuICAgICAgICAgICAgICAgIHQ6IHQsXG4gICAgICAgICAgICAgICAgYjogYlxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXRzIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50IHdoZW4gaXQgaXMgb3BlbmVkXG4gICAgICAgIF9nZXRGaW5hbERpbTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgbCA9IDAsXG4gICAgICAgICAgICAgICAgciA9IDAsXG4gICAgICAgICAgICAgICAgdCA9IDAsXG4gICAgICAgICAgICAgICAgYiA9IDAsXG4gICAgICAgICAgICAgICAgaG9yaXpUaW1lcyA9IDAsXG4gICAgICAgICAgICAgICAgdmVydFRpbWVzID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMuZm9sZHM7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGFzIGRlZmF1bHRcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25baV0gfHwgJ2JvdHRvbSc7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcikge1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnIDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndG9wJyA6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbScgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuaW5pdGlhbERpbS53aWR0aCAqIE1hdGgucG93KDIsIGhvcml6VGltZXMpLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5pbml0aWFsRGltLmhlaWdodCAqIE1hdGgucG93KDIsIHZlcnRUaW1lcylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgc2l6ZXMgYW5kIHBvc2l0aW9ucyBmb3IgdGhlIGVsZW1lbnQgYWZ0ZXIgZWFjaCAodW4pZm9sZGluZyBzdGVwXG4gICAgICAgIF91cGRhdGVTdGVwU3R5bGU6IGZ1bmN0aW9uIChhY3Rpb24pIHtcblxuICAgICAgICAgICAgdmFyIHcsIGgsIGwsIHQ7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdmb2xkJykge1xuXG4gICAgICAgICAgICAgICAgdyA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ2xlZnQnIHx8IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ3JpZ2h0JyA/IHRoaXMubGFzdFN0eWxlLndpZHRoIC8gMiA6IHRoaXMubGFzdFN0eWxlLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAnbGVmdCcgfHwgdGhpcy5sYXN0RGlyZWN0aW9uID09PSAncmlnaHQnID8gdGhpcy5sYXN0U3R5bGUuaGVpZ2h0IDogdGhpcy5sYXN0U3R5bGUuaGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICAgICAgbCA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ2xlZnQnID8gdGhpcy5sYXN0U3R5bGUubGVmdCArIHRoaXMubGFzdFN0eWxlLndpZHRoIC8gMiA6IHRoaXMubGFzdFN0eWxlLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHQgPSB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICd0b3AnID8gdGhpcy5sYXN0U3R5bGUudG9wICsgdGhpcy5sYXN0U3R5bGUuaGVpZ2h0IC8gMiA6IHRoaXMubGFzdFN0eWxlLnRvcDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB3ID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAnbGVmdCcgfHwgdGhpcy5sYXN0RGlyZWN0aW9uID09PSAncmlnaHQnID8gdGhpcy5sYXN0U3R5bGUud2lkdGggKiAyIDogdGhpcy5sYXN0U3R5bGUud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGggPSB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICdsZWZ0JyB8fCB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICdyaWdodCcgPyB0aGlzLmxhc3RTdHlsZS5oZWlnaHQgOiB0aGlzLmxhc3RTdHlsZS5oZWlnaHQgKiAyLFxuICAgICAgICAgICAgICAgICAgICBsID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAnbGVmdCcgPyB0aGlzLmxhc3RTdHlsZS5sZWZ0IC0gdGhpcy5sYXN0U3R5bGUud2lkdGggOiB0aGlzLmxhc3RTdHlsZS5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0ID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAndG9wJyA/IHRoaXMubGFzdFN0eWxlLnRvcCAtIHRoaXMubGFzdFN0eWxlLmhlaWdodCA6IHRoaXMubGFzdFN0eWxlLnRvcDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB3LFxuICAgICAgICAgICAgICAgIGhlaWdodDogaCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBsLFxuICAgICAgICAgICAgICAgIHRvcDogdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIG9wcG9zaXRlIGRpcmVjdGlvblxuICAgICAgICBfZ2V0T3Bwb3NpdGVEaXJlY3Rpb246IGZ1bmN0aW9uIChyZWFsZGlyZWN0aW9uKSB7XG5cbiAgICAgICAgICAgIHZhciBydmQ7XG5cbiAgICAgICAgICAgIHN3aXRjaCAocmVhbGRpcmVjdGlvbikge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCcgOlxuICAgICAgICAgICAgICAgICAgICBydmQgPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCcgOlxuICAgICAgICAgICAgICAgICAgICBydmQgPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCcgOlxuICAgICAgICAgICAgICAgICAgICBydmQgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgIHJ2ZCA9ICd0b3AnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcnZkO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIG1haW4gZnVuY3Rpb246IHVuZm9sZHMgYW5kIGZvbGRzIHRoZSBlbGVtZW50IFtvcHRpb25zLmZvbGRzXSB0aW1lcyBieSB1c2luZyByZWN1cnNpdmUgY2FsbHNcbiAgICAgICAgX3N0YXJ0OiBmdW5jdGlvbiAoYWN0aW9uLCBzdGVwKSB7XG5cbiAgICAgICAgICAgIC8vIEJhc2ljYWxseSB3ZSBhcmUgcmVwbGFjaW5nIHRoZSBlbGVtZW50J3MgY29udGVudCB3aXRoIDIgZGl2aXNpb25zLCB0aGUgdG9wIGFuZCBib3R0b20gZWxlbWVudHMuXG4gICAgICAgICAgICAvLyBUaGUgdG9wIGVsZW1lbnQgd2lsbCBoYXZlIGEgZnJvbnQgYW5kIGJhY2sgZmFjZXMuIFRoZSBmcm9udCBoYXMgdGhlIGluaXRpYWwgY29udGVudCBmb3IgdGhlIGZpcnN0IHN0ZXBcbiAgICAgICAgICAgIC8vIGFuZCB0aGUgYmFjayB3aWxsIGhhdmUgdGhlIGZpbmFsIGNvbnRlbnQgZm9yIHRoZSBsYXN0IHN0ZXAuIEZvciBhbGwgdGhlIG90aGVyIGNhc2VzIHRoZSB0b3AgZWxlbWVudCB3aWxsIGJlIGJsYW5rLlxuICAgICAgICAgICAgLy8gVGhlIGJvdHRvbSBlbGVtZW50IHdpbGwgaGF2ZSB0aGUgZmluYWwgY29udGVudCBmb3IgdGhlIGxhc3Qgc3RlcCBhbmQgd2lsbCBiZSBibGFuayBmb3IgYWxsIHRoZSBvdGhlciBjYXNlcy5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ga2VlcCB0aGUgcmlnaHQgc2l6ZXMgYW5kIHBvc2l0aW9ucyBmb3IgdGhlc2UgMiBlbGVtZW50cywgc28gd2UgbmVlZCB0byBjYWNoZSB0aGUgcHJldmlvdXMgc3RlcCdzIHN0YXRlLlxuXG4gICAgICAgICAgICBzdGVwIHw9IDA7XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzdHlsZUNTUyA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMubGFzdFN0eWxlLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMubGFzdFN0eWxlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5sYXN0U3R5bGUubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmxhc3RTdHlsZS50b3BcbiAgICAgICAgICAgICAgICB9IDogdGhpcy5pbml0aWFsRGltLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUb3BGcm9udCA9ICcnLCBjb250ZW50Qm90dG9tID0gJycsIGNvbnRlbnRUb3BCYWNrID0gJycsXG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aW9uIGZvciBzdGVwIFtzdGVwXVxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBpcyB0aGUgZGVmYXVsdCB2YWx1ZSBpZiBub25lIGlzIHByZXNlbnRcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9sZGRpcmVjdGlvblt0aGlzLm9wdGlvbnMuZm9sZHMgLSAxIC0gc3RlcF0gfHwgJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9sZGRpcmVjdGlvbltzdGVwXSB8fCAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICAvLyBmdXR1cmUgZGlyZWN0aW9uIHZhbHVlIChvbmx5IGZvciB0aGUgXCJmb2xkXCIgYWN0aW9uKVxuICAgICAgICAgICAgICAgIG5leHRkaXJlY3Rpb24gPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyB0aGlzLm9wdGlvbnMuZm9sZGRpcmVjdGlvblt0aGlzLm9wdGlvbnMuZm9sZHMgLSAyIC0gc3RlcF0gfHwgJ2JvdHRvbScgOiAnJztcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHVjLXBhcnQgZGl2cyBpbnNpZGUgdGhlIGNvbnRhaW5lciAodGhlIHRvcCBhbmQgYm90dG9tIGVsZW1lbnRzKVxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnZGl2LnVjLXBhcnQnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgc3dpdGNoIChzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBzdGVwICYgbGFzdCB0cmFuc2l0aW9uIHN0ZXBcbiAgICAgICAgICAgICAgICBjYXNlIDAgOlxuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5vcHRpb25zLmZvbGRzIC0gMSA6XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ2ZvbGQnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwID09PSB0aGlzLm9wdGlvbnMuZm9sZHMgLSAxKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUNTUyA9IHRoaXMuaW5pdGlhbERpbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wRnJvbnQgPSB0aGlzLmlDb250ZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaW1PZmZzZXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5jc3Moe2xlZnQ6IDAsIHRvcDogMH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLl9zZXRMYXN0U3RlcChkaXJlY3Rpb24sIHN0eWxlQ1NTKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJvdHRvbSA9IGNvbnRlbnQuYm90dG9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wQmFjayA9IGNvbnRlbnQudG9wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZmluYWxFbC5oaWRlKCkuY2hpbGRyZW4oKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyB1bmZvbGRpbmdcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAgPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldERpbU9mZnNldCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgb3B0aW9ucy5jZW50ZXJlZCBpcyB0cnVlLCB3ZSBuZWVkIHRvIGNlbnRlciB0aGUgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVpdGhlciB3YXlzIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBjb250YWluZXIgZG9lcyBub3QgbW92ZSBvdXRzaWRlIHRoZSB2aWV3cG9ydC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQncyBnZXQgdGhlIGNvcnJlY3QgdHJhbnNsYXRpb24gdmFsdWVzIGZvciB0aGUgY29udGFpbmVyJ3MgdHJhbnNpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb29yZHMgPSB0aGlzLl9nZXRUcmFuc2xhdGlvblZpZXdwb3J0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygndWMtY3VycmVudCcpLmNzcyh7bGVmdDogY29vcmRzLmZ0eCwgdG9wOiBjb29yZHMuZnR5fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wRnJvbnQgPSB0aGlzLmlDb250ZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZmluYWxFbC5oaWRlKCkuY2hpbGRyZW4oKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVDU1MgPSB0aGlzLl91cGRhdGVTdGVwU3R5bGUoYWN0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcCA9PT0gdGhpcy5vcHRpb25zLmZvbGRzIC0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLl9zZXRMYXN0U3RlcChkaXJlY3Rpb24sIHN0eWxlQ1NTKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJvdHRvbSA9IGNvbnRlbnQuYm90dG9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wQmFjayA9IGNvbnRlbnQudG9wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gbGFzdCBzdGVwIGlzIHRvIHJlcGxhY2UgdGhlIHRvcEVsZW1lbnQgYW5kIGJvdHRvbUVsZW1lbnQgd2l0aCBhIGRpdmlzaW9uIHRoYXQgaGFzIHRoZSBmaW5hbCBjb250ZW50XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLm9wdGlvbnMuZm9sZHMgOlxuXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlQ1NTID0gKCBhY3Rpb24gPT09ICdmb2xkJykgPyB0aGlzLmluaXRpYWxEaW0gOiB0aGlzLl91cGRhdGVTdGVwU3R5bGUoYWN0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdG9wIGFuZCBib3R0b20gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRJZHggPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyAwIDogMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcudWMtcGFydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZmluYWxFbC5jc3Moc3R5bGVDU1MpLnNob3coKS5jaGlsZHJlbigpLmVxKGNvbnRlbnRJZHgpLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5lZCA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZyBlbHNlIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdmb2xkJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygndWMtY3VycmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRW5kRm9sZGluZygpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVuZFVuZm9sZGluZygpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZSBvdGhlciBzdGVwc1xuICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlIG9mIG5ldyBsYXlvdXQgd2lsbCBkZXBlbmQgb24gdGhlIGxhc3Qgc3RlcCBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgc3R5bGVDU1MgPSB0aGlzLl91cGRhdGVTdGVwU3R5bGUoYWN0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0cmFuc2l0aW9uIHByb3BlcnRpZXMgZm9yIHRoZSBzdGVwXG4gICAgICAgICAgICBpZiAodGhpcy5zdXBwb3J0KSB7XG5cbiAgICAgICAgICAgICAgICBzdHlsZUNTUy50cmFuc2l0aW9uID0gJ2FsbCAnICsgdGhpcy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1bmZvbGRDbGFzcyA9ICd1Yy11bmZvbGQtJyArIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB0b3BFbENsYXNzZXMgPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyAndWMtdW5mb2xkIHVjLXBhcnQgJyArIHVuZm9sZENsYXNzIDogJ3VjLXBhcnQgJyArIHVuZm9sZENsYXNzLFxuICAgICAgICAgICAgICAgICR0b3BFbCA9ICQoJzxkaXYgY2xhc3M9XCInICsgdG9wRWxDbGFzc2VzICsgJ1wiPjxkaXYgY2xhc3M9XCJ1Yy1mcm9udFwiPicgKyBjb250ZW50VG9wRnJvbnQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInVjLWJhY2tcIj4nICsgY29udGVudFRvcEJhY2sgKyAnPC9kaXY+PC9kaXY+JykuY3NzKHN0eWxlQ1NTKSxcbiAgICAgICAgICAgICAgICAkYm90dG9tRWwgPSAkKCc8ZGl2IGNsYXNzPVwidWMtcGFydCB1Yy1zaW5nbGVcIj4nICsgY29udGVudEJvdHRvbSArICc8L2Rpdj4nKS5jc3Moc3R5bGVDU1MpO1xuXG4gICAgICAgICAgICAvLyBjYWNoZSBsYXN0IGRpcmVjdGlvbiBhbmQgc3R5bGVcbiAgICAgICAgICAgIHRoaXMubGFzdERpcmVjdGlvbiA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IG5leHRkaXJlY3Rpb24gOiBkaXJlY3Rpb247XG4gICAgICAgICAgICB0aGlzLmxhc3RTdHlsZSA9IHN0eWxlQ1NTO1xuXG4gICAgICAgICAgICAvLyBhcHBlbmQgbmV3IGVsZW1lbnRzXG4gICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJGJvdHRvbUVsLCAkdG9wRWwpO1xuXG4gICAgICAgICAgICAvLyBhZGQgb3ZlcmxheXNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcmxheXMgJiYgdGhpcy5zdXBwb3J0KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRPdmVybGF5cyhhY3Rpb24sICRib3R0b21FbCwgJHRvcEVsKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIC8vIGFwcGx5IHN0eWxlXG4gICAgICAgICAgICAgICAgKCBhY3Rpb24gPT09ICdmb2xkJyApID8gJHRvcEVsLnJlbW92ZUNsYXNzKCd1Yy11bmZvbGQnKSA6ICR0b3BFbC5hZGRDbGFzcygndWMtdW5mb2xkJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdXBwb3J0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRvcEVsLm9uKHNlbGYudHJhbnNFbmRFdmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSAhPT0gJ3VjLWZsaXBvdmVybGF5JyAmJiBzdGVwIDwgc2VsZi5vcHRpb25zLmZvbGRzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnb3RvIG5leHQgc3RlcCBpbiBbb3B0aW9ucy5mb2xkZGVsYXldIG1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXJ0KGFjdGlvbiwgc3RlcCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0aW9ucy5mb2xkZGVsYXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZ290byBuZXh0IHN0ZXBcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3RhcnQoYWN0aW9uLCBzdGVwICsgMSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm92ZXJsYXlzICYmIHNlbGYuc3VwcG9ydCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBibyA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGJvID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID8gLjUgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGZvID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID8gMCA6IC41O1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGJvdHRvbU92ZXJsYXkuY3NzKCdvcGFjaXR5JywgYm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiR0b3BCYWNrT3ZlcmxheS5jc3MoJ29wYWNpdHknLCB0Ym8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiR0b3BGcm9udE92ZXJsYXkuY3NzKCdvcGFjaXR5JywgdGZvKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgMzApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldHMgdGhlIHRyYW5zbGF0aW9uIHZhbHVlcyBmb3IgdGhlIGNvbnRhaW5lcidzIHRyYW5zaXRpb25cbiAgICAgICAgX2dldFRyYW5zbGF0aW9uVmlld3BvcnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gdGhlIGFjY3VtdWxhdGVkVmFsdWVzIHN0b3JlcyB0aGUgbGVmdCwgcmlnaHQsIHRvcCBhbmQgYm90dG9tIGluY3JlbWVudHMgdG8gdGhlIGZpbmFsL29wZW5lZCBlbGVtZW50IHJlbGF0aXZlbHkgdG8gdGhlIGluaXRpYWwvY2xvc2VkIGVsZW1lbnRcbiAgICAgICAgICAgIHZhciBhY2N1bXVsYXRlZFZhbHVlcyA9IHRoaXMuX2dldEFjY3VtdWxhdGVkVmFsdWUoKSxcbiAgICAgICAgICAgICAgICB0eCA9IDAsXG4gICAgICAgICAgICAgICAgdHkgPSAwO1xuXG4gICAgICAgICAgICAvLyB0aGUgZmluYWwgb2Zmc2V0cyBmb3IgdGhlIG9wZW5lZCBlbGVtZW50XG4gICAgICAgICAgICB0aGlzLmZPZmZzZXRMID0gdGhpcy5pbml0aWFsRGltLm9mZnNldEwgLSBhY2N1bXVsYXRlZFZhbHVlcy5sO1xuICAgICAgICAgICAgdGhpcy5mT2Zmc2V0VCA9IHRoaXMuaW5pdGlhbERpbS5vZmZzZXRUIC0gYWNjdW11bGF0ZWRWYWx1ZXMudDtcbiAgICAgICAgICAgIHRoaXMuZk9mZnNldFIgPSB0aGlzLmluaXRpYWxEaW0ub2Zmc2V0UiAtIGFjY3VtdWxhdGVkVmFsdWVzLnI7XG4gICAgICAgICAgICB0aGlzLmZPZmZzZXRCID0gdGhpcy5pbml0aWFsRGltLm9mZnNldEIgLSBhY2N1bXVsYXRlZFZhbHVlcy5iO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5mT2Zmc2V0TCA8IDApIHtcbiAgICAgICAgICAgICAgICB0eCA9IE1hdGguYWJzKHRoaXMuZk9mZnNldEwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZk9mZnNldFQgPCAwKSB7XG4gICAgICAgICAgICAgICAgdHkgPSBNYXRoLmFicyh0aGlzLmZPZmZzZXRUKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZPZmZzZXRSIDwgMCkge1xuICAgICAgICAgICAgICAgIHR4IC09IE1hdGguYWJzKHRoaXMuZk9mZnNldFIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZk9mZnNldEIgPCAwKSB7XG4gICAgICAgICAgICAgICAgdHkgLT0gTWF0aC5hYnModGhpcy5mT2Zmc2V0Qik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbmFsIHRyYW5zbGF0aW9uIHZhbHVlc1xuICAgICAgICAgICAgdmFyIGZ0eCA9IHR4LFxuICAgICAgICAgICAgICAgIGZ0eSA9IHR5O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNlbnRlcmVkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRpb25WYWx1ZSA9IHRoaXMuX2dldFRyYW5zbGF0aW9uVmFsdWUoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvblZhbHVlLnggPiAwICYmIHRoaXMuZk9mZnNldFIgKyB0cmFuc2xhdGlvblZhbHVlLnggPj0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZ0eCA9ICggdGhpcy5mT2Zmc2V0TCA+PSAwICkgPyBNYXRoLm1pbih0cmFuc2xhdGlvblZhbHVlLngsIHRoaXMuZk9mZnNldFIpIDogdHJhbnNsYXRpb25WYWx1ZS54ICsgKCB0eCAtIHRyYW5zbGF0aW9uVmFsdWUueCApO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRyYW5zbGF0aW9uVmFsdWUueCA8IDAgJiYgdGhpcy5mT2Zmc2V0TCArIHRyYW5zbGF0aW9uVmFsdWUueCA+PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZnR4ID0gKCB0aGlzLmZPZmZzZXRSID49IDAgKSA/IE1hdGgubWluKHRyYW5zbGF0aW9uVmFsdWUueCwgdGhpcy5mT2Zmc2V0TCkgOiB0cmFuc2xhdGlvblZhbHVlLnggKyAoIHR4IC0gdHJhbnNsYXRpb25WYWx1ZS54ICk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZnR4ID0gdHJhbnNsYXRpb25WYWx1ZS54ICsgKCB0eCAtIHRyYW5zbGF0aW9uVmFsdWUueCApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0aW9uVmFsdWUueSA+IDAgJiYgdGhpcy5mT2Zmc2V0QiArIHRyYW5zbGF0aW9uVmFsdWUueSA+PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZnR5ID0gKCB0aGlzLmZPZmZzZXRUID49IDAgKSA/IE1hdGgubWluKHRyYW5zbGF0aW9uVmFsdWUueSwgdGhpcy5mT2Zmc2V0QikgOiB0cmFuc2xhdGlvblZhbHVlLnkgKyAoIHR5IC0gdHJhbnNsYXRpb25WYWx1ZS55ICk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHJhbnNsYXRpb25WYWx1ZS55IDwgMCAmJiB0aGlzLmZPZmZzZXRUICsgdHJhbnNsYXRpb25WYWx1ZS55ID49IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBmdHkgPSAoIHRoaXMuZk9mZnNldEIgPj0gMCApID8gTWF0aC5taW4odHJhbnNsYXRpb25WYWx1ZS55LCB0aGlzLmZPZmZzZXRUKSA6IHRyYW5zbGF0aW9uVmFsdWUueSArICggdHkgLSB0cmFuc2xhdGlvblZhbHVlLnkgKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBmdHkgPSB0cmFuc2xhdGlvblZhbHVlLnkgKyAoIHR5IC0gdHJhbnNsYXRpb25WYWx1ZS55ICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmdHg6IGZ0eCxcbiAgICAgICAgICAgICAgICBmdHk6IGZ0eVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBzZXRzIHRoZSBsYXN0IHN0ZXAncyBjb250ZW50XG4gICAgICAgIF9zZXRMYXN0U3RlcDogZnVuY3Rpb24gKGRpcmVjdGlvbiwgc3R5bGVDU1MpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnRCb3R0b20sIGNvbnRlbnRUb3BCYWNrLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b21TdHlsZSA9ICcnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUb3BCYWNrU3R5bGUgPSAnJztcblxuICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wQmFja1N0eWxlID0gJ21hcmdpbi10b3A6IC0nICsgc3R5bGVDU1MuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wJyA6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b21TdHlsZSA9ICdtYXJnaW4tdG9wOiAtJyArIHN0eWxlQ1NTLmhlaWdodCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnIDpcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEJhY2tTdHlsZSA9ICd3aWR0aDonICsgKCBzdHlsZUNTUy53aWR0aCAqIDIgKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b21TdHlsZSA9ICd3aWR0aDonICsgKCBzdHlsZUNTUy53aWR0aCAqIDIgKSArICdweDttYXJnaW4tbGVmdDogLScgKyBzdHlsZUNTUy53aWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JyA6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUb3BCYWNrU3R5bGUgPSAnd2l0aDonICsgKCBzdHlsZUNTUy53aWR0aCAqIDIgKSArICdweDttYXJnaW4tbGVmdDogLScgKyBzdHlsZUNTUy53aWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b21TdHlsZSA9ICd3aWR0aDonICsgKCBzdHlsZUNTUy53aWR0aCAqIDIgKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRlbnRCb3R0b20gPSAnPGRpdiBjbGFzcz1cInVjLWlubmVyXCI+PGRpdiBjbGFzcz1cInVjLWlubmVyLWNvbnRlbnRcIiBzdHlsZT1cIicgKyBjb250ZW50Qm90dG9tU3R5bGUgKyAnXCI+JyArIHRoaXMuZkNvbnRlbnQgKyAnPC9kaXY+PC9kaXY+JztcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnRUb3BCYWNrQ2xhc3NlcyA9IGRpcmVjdGlvbiA9PT0gJ3RvcCcgfHwgZGlyZWN0aW9uID09PSAnYm90dG9tJyA/ICd1Yy1pbm5lciB1Yy1pbm5lci1yb3RhdGUnIDogJ3VjLWlubmVyJztcbiAgICAgICAgICAgIGNvbnRlbnRUb3BCYWNrID0gJzxkaXYgY2xhc3M9XCInICsgY29udGVudFRvcEJhY2tDbGFzc2VzICsgJ1wiPjxkaXYgY2xhc3M9XCJ1Yy1pbm5lci1jb250ZW50XCIgc3R5bGU9XCInICsgY29udGVudFRvcEJhY2tTdHlsZSArICdcIj4nICsgdGhpcy5mQ29udGVudCArICc8L2Rpdj48L2Rpdj4nO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJvdHRvbTogY29udGVudEJvdHRvbSxcbiAgICAgICAgICAgICAgICB0b3A6IGNvbnRlbnRUb3BCYWNrXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFkZHMgb3ZlcmxheXMgdG8gdGhlIFwiKHVuKWZvbGRpbmdcIiBlbGVtZW50cyBpZiB0aGUgb3B0aW9ucy5vdmVybGF5cyBpcyB0cnVlXG4gICAgICAgIF9hZGRPdmVybGF5czogZnVuY3Rpb24gKGFjdGlvbiwgJGJvdHRvbUVsLCAkdG9wRWwpIHtcblxuICAgICAgICAgICAgdmFyIGJvdHRvbU92ZXJsYXlTdHlsZSwgdG9wRnJvbnRPdmVybGF5U3R5bGUsIHRvcEJhY2tPdmVybGF5U3R5bGU7XG5cbiAgICAgICAgICAgIHRoaXMuJGJvdHRvbU92ZXJsYXkgPSAkKCc8ZGl2IGNsYXNzPVwidWMtb3ZlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgdGhpcy4kdG9wRnJvbnRPdmVybGF5ID0gJCgnPGRpdiBjbGFzcz1cInVjLWZsaXBvdmVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICB0aGlzLiR0b3BCYWNrT3ZlcmxheSA9ICQoJzxkaXYgY2xhc3M9XCJ1Yy1mbGlwb3ZlcmxheVwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZm9sZCcpIHtcblxuICAgICAgICAgICAgICAgIGJvdHRvbU92ZXJsYXlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nICsgJyAnICsgKCB0aGlzLm9wdGlvbnMuc3BlZWQgLyAyICkgKyAnbXMnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRvcEZyb250T3ZlcmxheVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuNSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRvcEJhY2tPdmVybGF5U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAvIDIgKSArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgYm90dG9tT3ZlcmxheVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAnICsgKCB0aGlzLm9wdGlvbnMuc3BlZWQgLyAyICkgKyAnbXMgJyArIHRoaXMub3B0aW9ucy5lYXNpbmdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdG9wRnJvbnRPdmVybGF5U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAvIDIgKSArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0b3BCYWNrT3ZlcmxheVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuNSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nICsgJyAnICsgKCB0aGlzLm9wdGlvbnMuc3BlZWQgLyAyICkgKyAnbXMnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkYm90dG9tRWwuYXBwZW5kKHRoaXMuJGJvdHRvbU92ZXJsYXkuY3NzKGJvdHRvbU92ZXJsYXlTdHlsZSkpO1xuICAgICAgICAgICAgJHRvcEVsLmNoaWxkcmVuKCdkaXYudWMtZnJvbnQnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQodGhpcy4kdG9wRnJvbnRPdmVybGF5LmNzcyh0b3BGcm9udE92ZXJsYXlTdHlsZSkpXG4gICAgICAgICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdkaXYudWMtYmFjaycpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCh0aGlzLiR0b3BCYWNrT3ZlcmxheS5jc3ModG9wQmFja092ZXJsYXlTdHlsZSkpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2Q6IHVuZm9sZHMgdGhlIGVsZW1lbnRcbiAgICAgICAgdW5mb2xkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIG9wZW5lZCBhbHJlYWR5IG9yIGN1cnJlbnRseSAodW4pZm9sZGluZyByZXR1cm5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wZW5lZCB8fCB0aGlzLmFuaW1hdGluZykge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0KCd1bmZvbGQnKTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kOiBmb2xkcyB0aGUgZWxlbWVudFxuICAgICAgICBmb2xkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIG5vdCBvcGVuZWQgb3IgY3VycmVudGx5ICh1bilmb2xkaW5nIHJldHVyblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wZW5lZCB8fCB0aGlzLmFuaW1hdGluZykge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0KCdmb2xkJyk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogcmV0dXJucyAnb3BlbmVkJyBvciAnY2xvc2VkJ1xuICAgICAgICBnZXRTdGF0dXM6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICggdGhpcy5vcGVuZWQgKSA/ICdvcGVuZWQnIDogJ2Nsb3NlZCc7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5jb25zb2xlKSB7XG5cbiAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAkLmZuLnBmb2xkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEodGhpcywgJ3Bmb2xkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnN0YW5jZSAnLCBpbnN0YW5jZSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoXCJjYW5ub3QgY2FsbCBtZXRob2RzIG9uIHBmb2xkIHByaW9yIHRvIGluaXRpYWxpemF0aW9uOyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcImF0dGVtcHRlZCB0byBjYWxsIG1ldGhvZCAnXCIgKyBvcHRpb25zICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISQuaXNGdW5jdGlvbihpbnN0YW5jZVtvcHRpb25zXSkgfHwgb3B0aW9ucy5jaGFyQXQoMCkgPT09IFwiX1wiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoXCJubyBzdWNoIG1ldGhvZCAnXCIgKyBvcHRpb25zICsgXCInIGZvciBwZm9sZCBpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnN0YW5jZSAyJywgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLl9pbml0KCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSAkLmRhdGEodGhpcywgJ3Bmb2xkJywgbmV3ICQuUEZvbGQob3B0aW9ucywgdGhpcykpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnN0YW5jZSAnLCBpbnN0YW5jZSk7XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuXG4gICAgfTtcblxufSkoalF1ZXJ5LCB3aW5kb3cpOyJdLCJmaWxlIjoiZm9sZGluZy9qcy9qcXVlcnkucGZvbGQuanMifQ==
