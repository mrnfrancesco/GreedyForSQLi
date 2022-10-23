jQuery(document).ready(function (e) {

    e(window).resize(function () {
        e.each(e('.squareDemo_production'), function (index, item_selector) {
            e(item_selector).height(e(item_selector).width() / (e(item_selector).attr('dw') / e(item_selector).attr('dh')))
            if (e(item_selector).find(".squareLitDemo").attr("entrance") == 1) {
                var height_val2 = e(item_selector).height();
                var title_val2 = e(item_selector).find("h3.title").height();
                e(item_selector).find(".squareLitDemo").animate({top: height_val2 - title_val2}, {queue: false, duration: 1})
            } else if (e(this).find(".squareLitDemo").attr("entrance") == 2) {
                var height_val3 = e(item_selector).height();
                var title_val3 = e(item_selector).find("h3.title").height();
                e(item_selector).find(".squareLitDemo").animate({top: -(height_val3 - title_val3)}, {queue: false, duration: 1})
            } else if (e(this).find(".squareLitDemo").attr("entrance") == 3) {
                var width_val4 = e(item_selector).width();
                e(item_selector).find(".squareLitDemo").animate({right: width_val4}, {queue: false, duration: 1})
            } else if (e(this).find(".squareLitDemo").attr("entrance") == 4) {
                var width_val5 = e(item_selector).width();
                e(item_selector).find(".squareLitDemo").animate({right: -width_val5}, {queue: false, duration: 1})
            }
        });
    });

    e.each(e('.squareDemo_production .squareLitDemo'), function (index, item_selector) {
        if (e(item_selector).attr('entrance') == 'effect') {
            e(item_selector).removeClass('fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig bounce flash pulse shake swing tada wobble bounceOut zoomOutUp zoomOutRight hinge zoomOutLeft zoomOut rollOut zoomOutDown bounceOutDown rotateOutUpRight rotateOutUpLeft rotateOutDownRight rotateOutDownLeft rotateOut bounceOutLeft lightSpeedOut bounceOutRight bounceOutUp flipOutX flipOutY').addClass('wpvsbb_hide_quick')
        }

        e(item_selector).parents('.squareDemo_production').height(e(item_selector).parents('.squareDemo_production').width() / (e(item_selector).parents('.squareDemo_production').attr('dw') / e(item_selector).parents('.squareDemo_production').attr('dh')))

        height_val2 = e(item_selector).parents('.squareDemo_production').height();
        width_val2 = e(item_selector).parents('.squareDemo_production').width();
        title_val2 = e(item_selector).find("h3.title").height();

        if (e(item_selector).attr("entrance") == 1) {
            e(item_selector).animate({top: height_val2 - title_val2}, {queue: false, duration: 1})
        } else if (e(item_selector).attr("entrance") == 2) {
            e(item_selector).animate({top: -(height_val2 - title_val2)}, {queue: false, duration: 1})
        } else if (e(item_selector).attr("entrance") == 3) {
            e(item_selector).animate({right: width_val2}, {queue: false, duration: 1})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 4) {
            ee(item_selector).animate({right: -width_val2}, {queue: false, duration: 1})
        }
    });
    e(".squareDemo_production").unbind("hover");
    e(".squareDemo_production").hover(function () {
        var link_out = e(this).find('.squareLitDemo.shape').find('.title_link_out').attr('href');
        e(this).find('.title_link_out').off('click');
        e(this).find('.title_link_out').on('click', function (event) {
            event.stopPropagation();
        })
        e(this).find('.squareLitDemo').removeClass('wpvsbb_hide_quick')
        if (link_out == '' || typeof(link_out) == 'undefined') {
            e(this).find('.squareLitDemo.shape').find('.title_link_out').css('cursor', 'default');
            e(this).find('.squareLitDemo.shape').css('cursor', 'default');
        } else {
            e(this).find('.squareLitDemo.shape').css('cursor', 'pointer');
        }
        e(this).find('.squareLitDemo.shape').off('click');
        e(this).find('.squareLitDemo.shape').on('click', function (event) {
            if (e(this).find('.title_link_out').attr('href') == '') {
                e(this).find('.title_link_out').css('cursor', 'default')
                event.preventDefault();
                event.stopPropagation();
            }
            if (link_out != '' && typeof(link_out) != 'undefined' && e(this).find('.title_link_out').attr('target') == 'blank') {
                e(this).find('.title_link_out')[0].click();
            } else if (link_out != '' && typeof(link_out) != 'undefined') {
                window.location = link_out;
            }
        });
        height_val = e(this).height();
        width_val = e(this).width();
        title_val = e(".squareLitDemo.shape h3.title").height();
        if (e(this).find(".squareLitDemo").attr("entrance") == 1) {
            e(this).find(".squareLitDemo").animate({top: "0"}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 2) {
            e(this).find(".squareLitDemo").animate({top: "0"}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 3) {
            e(this).find(".squareLitDemo").animate({right: "0"}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 4) {
            e(this).find(".squareLitDemo").animate({right: "0"}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == "effect") {
            if (!e(this).find(".squareDemo_production").hasClass("maskImg")) {
                e(this).find(".squareDemo_production").addClass("maskImg")
            }
            e(this).find(".squareLitDemo").removeClass("animated " + e(this).find(".squareLitDemo").attr("out")).addClass("animated " + e(this).find(".squareLitDemo").attr("in"))
        }
    }, function () {
        if (e(this).find(".squareLitDemo").attr("entrance") == 1) {
            e(this).find(".squareLitDemo").animate({top: height_val - title_val}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 2) {
            e(this).find(".squareLitDemo").animate({top: -(height_val - title_val)}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 3) {
            e(this).find(".squareLitDemo").animate({right: width_val}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == 4) {
            e(this).find(".squareLitDemo").animate({right: -width_val}, {queue: false, duration: 400})
        } else if (e(this).find(".squareLitDemo").attr("entrance") == "effect") {
            e(this).find(".squareLitDemo").removeClass("animated " + e(this).find(".squareLitDemo").attr("in")).addClass("animated " + e(this).find(".squareLitDemo").attr("out"))
        }
    });

})