var timerSlider = null;
var periodSlider = 3000;
var speedSlider = 1000;

var timerIndex = null
var periodIndex = 5000;

var timerGeo = null
var periodGeo = 5000;

$(document).ready(function() {

    $('.header-menu-link a').click(function(e) {
        $('html').toggleClass('mobile-menu-open');
        e.preventDefault();
    });

    $('.nav ul li a, .footer-menu ul li a, .nav-mobile-inner ul li a').click(function(e) {
        $('html').removeClass('mobile-menu-open');
        var curBlock = $($(this).attr('href'));
        if (curBlock.length > 0) {
            $('html, body').animate({'scrollTop': curBlock.offset().top});
        }
        e.preventDefault();
    });

    $('.slider').each(function() {
        var curSlider = $(this);
        curSlider.find('.slider-item').eq(0).addClass('active');
        if (curSlider.find('.slider-item').length > 1) {
            var newHTML = '<div class="slider-mobile-dots">';
            curSlider.find('.slider-item').each(function() {
                newHTML += '<a href="#"></a>';
            });
            newHTML += '</div>';
            curSlider.append(newHTML);
            curSlider.find('.slider-mobile-dots a').eq(0).addClass('active');
            curSlider.find('.slider-prev, .slider-next').addClass('visible');
            curSlider.data('curIndex', 0);
            curSlider.data('isAnimate', false);
            timerSlider = window.setTimeout(sliderNext, periodSlider);
        }
    });

    function sliderNext() {
        var curSlider = $('.slider');
        var curIndex = curSlider.data('curIndex');
        var newIndex = curIndex + 1;
        if (newIndex > curSlider.find('.slider-item').length - 1) {
            newIndex = 0;
        }
        sliderAnimate(curIndex, newIndex);
    }

    function sliderPrev() {
        var curSlider = $('.slider');
        var curIndex = curSlider.data('curIndex');
        var newIndex = curIndex - 1;
        if (newIndex < 0) {
            newIndex = curSlider.find('.slider-item').length - 1;
        }
        sliderAnimate(curIndex, newIndex);
    }

    $('.slider-prev').click(function(e) {
        window.clearTimeout(timerSlider);
        timerSlider = null;
        sliderPrev();
        e.preventDefault();
    });

    $('.slider-next').click(function(e) {
        window.clearTimeout(timerSlider);
        timerSlider = null;
        sliderNext();
        e.preventDefault();
    });

    $('.slider-list').swipe({
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'left') {
                $('.slider-next').trigger('click');
            }
            if (direction == 'right') {
                $('.slider-prev').trigger('click');
            }
        },
        threshold: 0,
        triggerOnTouchEnd: false,
        triggerOnTouchLeave: true,
        allowPageScroll: 'auto'
    });

    $('body').on('click', '.slider-mobile-dots a', function(e) {
        if (!$(this).hasClass('active')) {
            window.clearTimeout(timerSlider);
            timerSlider = null;
            var curSlider = $('.slider');
            var curIndex = curSlider.data('curIndex');
            var newIndex = $('.slider-mobile-dots a').index($(this));
            sliderAnimate(curIndex, newIndex);
        }
        e.preventDefault();
    });

    function sliderAnimate(curIndex, newIndex) {
        var curSlider = $('.slider');
        if (!curSlider.data('isAnimate')) {
            curSlider.data('isAnimate', true);
            curSlider.find('.slider-mobile-dots a.active').removeClass('active');
            curSlider.find('.slider-mobile-dots a').eq(newIndex).addClass('active');
            curSlider.find('.slider-item').eq(curIndex).css({'z-index': 1});
            curSlider.find('.slider-item').eq(newIndex).css({'z-index': 2, 'opacity': 1});
            curSlider.find('.slider-item').eq(newIndex).find('.slider-item-bg').css({'opacity': 0});
            curSlider.find('.slider-item').eq(newIndex).find('.slider-item-img').css({'opacity': 0});
            curSlider.find('.slider-item').eq(newIndex).find('.slider-item-img img').css({'transform': 'scale(0.8)', 'transition': 'all 0.' + speedSlider / 2 + 's'});
            curSlider.find('.slider-item').eq(newIndex).find('.slider-item-container').css({'opacity': 0, 'top': 50});
            curSlider.find('.slider-item').eq(curIndex).find('.slider-item-container').animate({'opacity': 0, 'top': -50}, speedSlider / 2, function() {
                curSlider.find('.slider-item').eq(newIndex).find('.slider-item-bg').css({'opacity': 1});
                curSlider.find('.slider-item').eq(newIndex).find('.slider-item-img').animate({'opacity': 1}, speedSlider / 2);
                curSlider.find('.slider-item').eq(newIndex).find('.slider-item-img img').css({'transform': 'scale(1)'});
                curSlider.find('.slider-item').eq(newIndex).find('.slider-item-container').animate({'opacity': 1, 'top': 0}, speedSlider / 2, function() {
                    curSlider.find('.slider-item').eq(curIndex).css({'z-index': 0, 'opacity': 0});
                    curSlider.data('isAnimate', false);
                    curSlider.data('curIndex', newIndex);
                    timerSlider = window.setTimeout(sliderNext, periodSlider);
                });
            });
        }
    }

    $('.services-more-btn a').click(function(e) {
        var curList = $(this).parents().filter('.services-container').find('.services-list');
        var lastIndex = curList.data('lastIndex');
        curList.data('lastIndex', lastIndex + 3);
        curList.find('.services-item').eq(lastIndex + 1).addClass('visible');
        curList.find('.services-item').eq(lastIndex + 2).addClass('visible');
        curList.find('.services-item').eq(lastIndex + 3).addClass('visible');
        if (curList.find('.services-item:not(.visible)').length == 0) {
            $(this).parent().remove();
        }
        e.preventDefault();
    });

    if ($('.index').length > 0) {
        updateIndex();
        createIndexMobile();
    }

    $('.index-more-btn a').click(function(e) {
        var curList = $('.index-mobile');
        var lastIndex = curList.data('lastIndex');
        curList.data('lastIndex', lastIndex + indexSizeMobile);
        for (var i = 0; i < indexSizeMobile; i++) {
            curList.find('.index-table-row').eq(lastIndex + i + 1).addClass('visible');
        }
        if (curList.find('.index-table-row:not(.visible)').length == 0) {
            $(this).parent().remove();
        }
        e.preventDefault();
    });

    $('.index-desktop .index-table').on('mouseover', function() {
        window.clearTimeout(timerIndex);
        timerIndex = null;
    });

    $('.index-desktop .index-table').on('mouseout', function() {
        timerIndex = window.setTimeout(updateIndex, periodIndex);
    });

    $('.news-more-btn a').click(function(e) {
        var curList = $(this).parents().filter('.news').find('.news-list');
        var lastIndex = curList.data('lastIndex');
        curList.data('lastIndex', lastIndex + 3);
        if ($(window).width() > 767) {
            curList.data('lastIndex', lastIndex + 4);
        }
        curList.find('.news-item').eq(lastIndex + 1).addClass('visible');
        curList.find('.news-item').eq(lastIndex + 2).addClass('visible');
        curList.find('.news-item').eq(lastIndex + 3).addClass('visible');
        if ($(window).width() > 767) {
            curList.find('.news-item').eq(lastIndex + 4).addClass('visible');
        }
        if (curList.find('.news-item:not(.visible)').length == 0) {
            $(this).parent().remove();
        }

        $('.news-item-text').each(function() {
            var curItem = $(this);
            if (typeof (curItem.data('text')) == 'undefined') {
                curItem.data('text', curItem.find('.news-item-anonce').html());
            }
            var fullText = curItem.data('text');
            var splitText = fullText.split(' ');
            curItem.find('.news-item-anonce').html('');
            var newLength = 0;
            for (var i = 0; i < splitText.length; i++) {
                curItem.find('.news-item-anonce').append(' ' + splitText[i]);
                if (curItem.find('.news-item-text-inner').height() <= curItem.height()) {
                    newLength = i;
                }
            }
            curItem.find('.news-item-anonce').html('');
            for (var i = 0; i < newLength; i++) {
                curItem.find('.news-item-anonce').append(' ' + splitText[i]);
            }
            if (newLength < splitText.length - 1) {
                curItem.find('.news-item-anonce').append(' ...');
            }
        });

        e.preventDefault();
    });

    $('.analitic-more-btn a').click(function(e) {
        var curList = $(this).parents().filter('.analitic').find('.analitic-list');
        var lastIndex = curList.data('lastIndex');
        curList.data('lastIndex', lastIndex + 3);
        if ($(window).width() > 767) {
            curList.data('lastIndex', lastIndex + 4);
        }
        curList.find('.analitic-item').eq(lastIndex + 1).addClass('visible');
        curList.find('.analitic-item').eq(lastIndex + 2).addClass('visible');
        curList.find('.analitic-item').eq(lastIndex + 3).addClass('visible');
        if ($(window).width() > 767) {
            curList.find('.analitic-item').eq(lastIndex + 4).addClass('visible');
        }
        if (curList.find('.analitic-item:not(.visible)').length == 0) {
            $(this).parent().remove();
        }
        e.preventDefault();
    });

    updateGeo();

    $('.geo-map-item-icon').click(function() {
        var curItem = $(this).parent();
        $('.geo-map-item.open').removeClass('open');
        $('.geo-map').data('curIndex', $('.geo-map-item').index(curItem));
        curItem.addClass('open');
        window.clearTimeout(timerGeo);
        timerGeo = null;
        timerGeo = window.setTimeout(updateGeo, periodGeo);
    });

    $('#chart1, #chart3, #chart4, #chart6').each(function() {
        var curChart = $(this);
        var curTips = curChart.parent().find('.stats-item-graph-bar-tips');
        var chartData = null;
        switch(curChart.attr('id')) {
            case 'chart1':
                chartData = dataChart1;
                break;
            case 'chart3':
                chartData = dataChart3;
                break;
            case 'chart4':
                chartData = dataChart4;
                break;
            case 'chart6':
                chartData = dataChart6;
                break;
            default:
                break;
        }
        for (var i = 0; i < chartData.length; i++) {
            curTips.append('<div class="stats-item-graph-bar-tip">' + chartData[i] + '</div>');
        }
        curTips.find('.stats-item-graph-bar-tip').css({'width': (100 / chartData.length) + '%'});
    });

    $('#chart2').each(function() {
        var summ = 0;
        for (var i = 0; i < dataChart2.length; i++) {
            summ += dataChart2[i];
        }
        $('#chart2-avg').html(summ);
    });

    $('#chart5').each(function() {
        var summ = 0;
        for (var i = 0; i < dataChart5.length; i++) {
            summ += dataChart5[i];
        }
        $('#chart5-avg').html(Math.round(summ / dataChart5.length));
    });

    $('.partners-more-btn a').click(function(e) {
        var curList = $(this).parents().filter('.partners').find('.partners-list');
        var lastIndex = curList.data('lastIndex');
        curList.data('lastIndex', lastIndex + 6);
        curList.find('.partners-item').eq(lastIndex + 1).addClass('visible');
        curList.find('.partners-item').eq(lastIndex + 2).addClass('visible');
        curList.find('.partners-item').eq(lastIndex + 3).addClass('visible');
        curList.find('.partners-item').eq(lastIndex + 4).addClass('visible');
        curList.find('.partners-item').eq(lastIndex + 5).addClass('visible');
        curList.find('.partners-item').eq(lastIndex + 6).addClass('visible');
        if (curList.find('.partners-item:not(.visible)').length == 0) {
            $(this).parent().remove();
        }
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.window-service-info-row-title', function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

});

$(window).on('load resize scroll', function() {
    if ($(window).scrollTop() > $(window).height()) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }
});

function randomInteger(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function updateIndex() {
    $('.index-desktop .index-table').animate({'opacity': 0}, 500, function() {
        var newHTML = '';
        var curSize = indexSizeDesktop;
        if ($(window).width() < 1280) {
            curSize = indexSizeMobile;
        }
        var currentIndexes = [];
        for (var i = 0; i < curSize; i++) {
            var curIndex = randomInteger(0, indexData.length - 1);
            while (currentIndexes.indexOf(curIndex) != -1) {
                curIndex = randomInteger(0, indexData.length - 1);
            }
            currentIndexes.push(curIndex);
            var curItem = indexData[curIndex];
            newHTML += ' <a href="' + curItem.url + '" class="index-table-row window-link">' +
                            '<div class="index-table-name">' +
                                '<div class="index-table-mobile-header">' + $('.index-table-header').eq(0).html() + '</div>' +
                                '<div class="index-table-name-logo"><img src="' + curItem.logo + '" alt="" /></div>' +
                                '<div class="index-table-name-text">' + curItem.title + '</div>' +
                            '</div>' +
                            '<div class="index-table-geo">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(1).html() + '</div>' + curItem.geo + '</div>' +
                            '<div class="index-table-sector">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(2).html() + '</div>' + curItem.sector + '</div>' +
                            '<div class="index-table-achievs">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(3).html() + '</div>';
            if (typeof (curItem.achievs) != 'undefined') {
                for (var j = 0; j < curItem.achievs.length; j++) {
                    newHTML += '<img src="' + curItem.achievs[j] + '" alt="" />';
                }
            }
            newHTML += '    </div>' +
                        '</a>';
        }
        $('.index-desktop .index-table .index-table-row').remove();
        $('.index-desktop .index-table').append(newHTML);
        $('.index-desktop .index-table').animate({'opacity': 1}, 500, function() {
            timerIndex = window.setTimeout(updateIndex, periodIndex);
        });
    });
}

function createIndexMobile() {
    var newHTML = '';
    for (var i = 0; i < indexData.length; i++) {
        var curItem = indexData[i];
        newHTML += ' <a href="' + curItem.url + '" class="index-table-row window-link">' +
                        '<div class="index-table-name">' +
                            '<div class="index-table-mobile-header">' + $('.index-table-header').eq(0).html() + '</div>' +
                            '<div class="index-table-name-logo"><img src="' + curItem.logo + '" alt="" /></div>' +
                            '<div class="index-table-name-text">' + curItem.title + '</div>' +
                        '</div>' +
                        '<div class="index-table-geo">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(1).html() + '</div>' + curItem.geo + '</div>' +
                        '<div class="index-table-sector">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(2).html() + '</div>' + curItem.sector + '</div>' +
                        '<div class="index-table-achievs">' + '<div class="index-table-mobile-header">' + $('.index-table-header').eq(3).html() + '</div>';
        if (typeof (curItem.achievs) != 'undefined') {
            for (var j = 0; j < curItem.achievs.length; j++) {
                newHTML += '<img src="' + curItem.achievs[j] + '" alt="" />';
            }
        }
        newHTML += '    </div>' +
                    '</a>';
    }
    $('.index-mobile .index-table').append(newHTML);
    for (var i = 0; i < indexSizeMobile; i++) {
        $('.index-mobile .index-table-row').eq(i).addClass('visible');
    }
    $('.index-mobile').data('lastIndex', indexSizeMobile - 1);
    if ($('.index-mobile .index-table-row').length <= indexSizeMobile) {
        $('.index-more-btn').addClass('invisible');
    } else {
        $('.index-more-btn').removeClass('invisible');
    }
}

function updateGeo() {
    $('.geo-map').each(function() {
        var curMap = $(this);
        if (typeof (curMap.data('curIndex')) == 'undefined') {
            curMap.data('curIndex', -1);
        }
        var curIndex = curMap.data('curIndex');
        curIndex++;
        if (curIndex > curMap.find('.geo-map-item').length - 1) {
            curIndex = 0;
        }
        curMap.find('.geo-map-item.open').removeClass('open');
        curMap.find('.geo-map-item').eq(curIndex).addClass('open');
        curMap.data('curIndex', curIndex);
    });
    timerGeo = window.setTimeout(updateGeo, periodGeo);
}

$(window).on('load resize scroll', function() {

    $('.nav').each(function() {
        if ($('.about').length > 0) {
            if ($(window).scrollTop() > $('.about').offset().top + $('.about').height()) {
                $('.nav').addClass('fixed');
                $('.header-menu-link').addClass('fixed');
            } else {
                $('.nav').removeClass('fixed');
                $('.header-menu-link').removeClass('fixed');
            }
        }

        $('.nav li.active').removeClass('active');
        $('.nav').find('li').each(function() {
            var curBlock = $($(this).find('a').attr('href'));
            if (curBlock.length > 0) {
                if ($(window).scrollTop() + $(window).height() / 2 > curBlock.offset().top) {
                    $('.nav li.active').removeClass('active');
                    $(this).addClass('active');
                }
            }
        });
        var curLink = $('.nav li.active');
        if (curLink.length > 0) {
            $('.nav-line').css({'width': curLink.width(), 'left': curLink.offset().left - $('.nav').offset().left});
        } else {
            $('.nav-line').css({'width': 0, 'left': 0});
        }
    });

});

$(window).on('load resize', function() {
    $('.services-list').each(function() {
        var curList = $(this);
        curList.find('.services-item').eq(0).addClass('visible');
        curList.find('.services-item').eq(1).addClass('visible');
        curList.find('.services-item').eq(2).addClass('visible');
        curList.data('lastIndex', 2);
        if (curList.find('.services-item:not(.visible)').length == 0) {
            curList.parent().find('.services-more-btn').addClass('invisible');
        } else {
            curList.parent().find('.services-more-btn').removeClass('invisible');
        }
    });

    $('.services-list').each(function() {
        var curList = $(this);
        curList.find('.services-item-text').css({'min-height': '0px'});

        curList.find('.services-item-text').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.height();
            var curTop = curBlock.offset().top;

            curList.find('.services-item-text').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.height();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

    $('.news-item-text').each(function() {
        var curItem = $(this);
        if (typeof (curItem.data('text')) == 'undefined') {
            curItem.data('text', curItem.find('.news-item-anonce').html());
        }
        var fullText = curItem.data('text');
        var splitText = fullText.split(' ');
        curItem.find('.news-item-anonce').html('');
        var newLength = 0;
        for (var i = 0; i < splitText.length; i++) {
            curItem.find('.news-item-anonce').append(' ' + splitText[i]);
            if (curItem.find('.news-item-text-inner').height() <= curItem.height()) {
                newLength = i;
            }
        }
        curItem.find('.news-item-anonce').html('');
        for (var i = 0; i < newLength; i++) {
            curItem.find('.news-item-anonce').append(' ' + splitText[i]);
        }
        if (newLength < splitText.length - 1) {
            curItem.find('.news-item-anonce').append(' ...');
        }
    });

    if (!$('.news-list').hasClass('slick-slider')) {
        $('.news-list').slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            prevArrow: '<button type="button" class="slick-prev"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.22379 10L13 18.3777L11.6371 20L1.31134e-06 10L11.6371 1.52602e-06L13 1.62234L3.22379 10Z" /></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.77621 10L1.16642e-06 1.62234L1.3629 1.52602e-06L13 10L1.36291 20L3.36361e-06 18.3777L9.77621 10Z" /></svg></button>',
            dots: true,
            responsive: [
                {
                    breakpoint: 1279,
                    settings: 'unslick'
                }
            ]
        }).on('setPosition', function(event, slick) {
            var curSlider = $(this);
            var curDotsWidth = curSlider.find('.slick-dots').width() + 60;
            curSlider.find('.slick-prev').css({'margin-right': curDotsWidth / 2});
            curSlider.find('.slick-next').css({'margin-left': curDotsWidth / 2});
            if (curSlider.find('.slick-dots').length > 0) {
                curSlider.removeClass('without-dots');
            } else {
                curSlider.addClass('without-dots');
            }
        });
    }

    $('.news-list').each(function() {
        var curList = $(this);
        curList.find('.news-item').eq(0).addClass('visible');
        curList.find('.news-item').eq(1).addClass('visible');
        curList.find('.news-item').eq(2).addClass('visible');
        if ($(window).width() > 767) {
            curList.find('.news-item').eq(3).addClass('visible');
        }
        curList.data('lastIndex', 2);
        if ($(window).width() > 767) {
            curList.data('lastIndex', 3);
        }
        if (curList.find('.news-item:not(.visible)').length == 0) {
            curList.parent().find('.news-more-btn').addClass('invisible');
        } else {
            curList.parent().find('.news-more-btn').removeClass('invisible');
        }
    });

    if (!$('.analitic-list').hasClass('slick-slider')) {
        $('.analitic-list').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            prevArrow: '<button type="button" class="slick-prev"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.22379 10L13 18.3777L11.6371 20L1.31134e-06 10L11.6371 1.52602e-06L13 1.62234L3.22379 10Z" /></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.77621 10L1.16642e-06 1.62234L1.3629 1.52602e-06L13 10L1.36291 20L3.36361e-06 18.3777L9.77621 10Z" /></svg></button>',
            dots: true,
            responsive: [
                {
                    breakpoint: 1279,
                    settings: 'unslick'
                }
            ]
        }).on('setPosition', function(event, slick) {
            var curSlider = $(this);
            var curDotsWidth = curSlider.find('.slick-dots').width() + 60;
            curSlider.find('.slick-prev').css({'margin-right': curDotsWidth / 2});
            curSlider.find('.slick-next').css({'margin-left': curDotsWidth / 2});
            if (curSlider.find('.slick-dots').length > 0) {
                curSlider.removeClass('without-dots');
            } else {
                curSlider.addClass('without-dots');
            }
        });
    }

    $('.analitic-list').each(function() {
        var curList = $(this);
        curList.find('.analitic-item').eq(0).addClass('visible');
        curList.find('.analitic-item').eq(1).addClass('visible');
        curList.find('.analitic-item').eq(2).addClass('visible');
        if ($(window).width() > 767) {
            curList.find('.analitic-item').eq(3).addClass('visible');
        }
        curList.data('lastIndex', 2);
        if ($(window).width() > 767) {
            curList.data('lastIndex', 3);
        }
        if (curList.find('.analitic-item:not(.visible)').length == 0) {
            curList.parent().find('.analitic-more-btn').addClass('invisible');
        } else {
            curList.parent().find('.analitic-more-btn').removeClass('invisible');
        }
    });

    $('.geo-map').each(function() {
        var curMap = $(this);
        var curImg = curMap.find('.geo-map-img');
        var startWidth = curImg.data('width');
        var nowWidth = curImg.width();
        var diff = nowWidth / startWidth;
        curMap.find('.geo-map-item').each(function() {
            var curItem = $(this);
            curItem.css({'left': curItem.data('left') * diff, 'top': curItem.data('top') * diff});
        });
    });

    if ($(window).width() > 767) {
        if ($('.stats-content').hasClass('slick-slider')) {
            $('.stats-content').slick('unslick');
        }
    } else {
        if (!$('.stats-content').hasClass('slick-slider')) {
            $('.stats-content').slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                variableWidth: true,
                centerMode: true
            });
        }
    }

    if (!$('.partners-list').hasClass('slick-slider')) {
        $('.partners-list').slick({
            infinite: false,
            slidesToShow: 6,
            slidesToScroll: 6,
            prevArrow: '<button type="button" class="slick-prev"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.22379 10L13 18.3777L11.6371 20L1.31134e-06 10L11.6371 1.52602e-06L13 1.62234L3.22379 10Z" /></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.77621 10L1.16642e-06 1.62234L1.3629 1.52602e-06L13 10L1.36291 20L3.36361e-06 18.3777L9.77621 10Z" /></svg></button>',
            dots: true,
            responsive: [
                {
                    breakpoint: 1279,
                    settings: 'unslick'
                }
            ]
        }).on('setPosition', function(event, slick) {
            var curSlider = $(this);
            var curDotsWidth = curSlider.find('.slick-dots').width() + 60;
            curSlider.find('.slick-prev').css({'margin-right': curDotsWidth / 2});
            curSlider.find('.slick-next').css({'margin-left': curDotsWidth / 2});
            if (curSlider.find('.slick-dots').length > 0) {
                curSlider.removeClass('without-dots');
            } else {
                curSlider.addClass('without-dots');
            }
        });
    }

    $('.partners-list').each(function() {
        var curList = $(this);
        curList.find('.partners-item').eq(0).addClass('visible');
        curList.find('.partners-item').eq(1).addClass('visible');
        curList.find('.partners-item').eq(2).addClass('visible');
        curList.find('.partners-item').eq(3).addClass('visible');
        curList.find('.partners-item').eq(4).addClass('visible');
        curList.find('.partners-item').eq(5).addClass('visible');
        curList.data('lastIndex', 5);
        if (curList.find('.partners-item:not(.visible)').length == 0) {
            curList.parent().find('.partners-more-btn').addClass('invisible');
        } else {
            curList.parent().find('.partners-more-btn').removeClass('invisible');
        }
    });

});

if (document.getElementById('stats') !== null) {

    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(drawChart1);
    google.charts.setOnLoadCallback(drawChart2);
    google.charts.setOnLoadCallback(drawChart3);
    google.charts.setOnLoadCallback(drawChart4);
    google.charts.setOnLoadCallback(drawChart5);
    google.charts.setOnLoadCallback(drawChart6);
    google.charts.setOnLoadCallback(redrawChart);
}

function redrawChart() {
    window.onresize = function() {
        drawChart1();
        drawChart2();
        drawChart3();
        drawChart4();
        drawChart5();
        drawChart6();
    };
}

function drawChart1() {
    drawChartColumns(document.getElementById('chart1'), dataChart1, document.getElementById('chart1-avg'));
}

function drawChart2() {
    drawChartDonut(document.getElementById('chart2'), dataChart2);
}

function drawChart3() {
    drawChartColumns(document.getElementById('chart3'), dataChart3, document.getElementById('chart3-avg'));
}

function drawChart4() {
    drawChartColumns(document.getElementById('chart4'), dataChart4, document.getElementById('chart4-avg'));
}

function drawChart5() {
    drawChartDonut(document.getElementById('chart5'), dataChart5);
}

function drawChart6() {
    drawChartColumns(document.getElementById('chart6'), dataChart6, document.getElementById('chart6-avg'));
}

function drawChartColumns(chartDiv, chartData, chartDivAvg) {
    var dataArray = [];
    dataArray.push(['Name', 'Value', { role: 'style' }]);
    var dataMax = 0;
    var dataAvg = 0;
    for (var i = 0; i < chartData.length; i++) {
        dataArray.push(['', chartData[i], chartColors[i]]);
        if (dataMax < chartData[i]) {
            dataMax = chartData[i];
        }
        dataAvg += chartData[i];
    }
    dataAvg = Math.round(dataAvg / chartData.length);
    chartDivAvg.innerHTML = dataAvg;

    var data = new google.visualization.arrayToDataTable(dataArray);

    var options = {
        legend: {position: 'none'},
        bar: {groupWidth: '100%'},
        axisTitlesPosition: 'none',
        chartArea:{left: 0, top: 0, width: '100%', height: '100%'},
        enableInteractivity: false,
        titlePosition: 'none',
        vAxis: {
            baselineColor: '#fff',
            gridlines: {color: '#fff'},
            viewWindow: {
                'min': 0,
                'max': dataMax
            }
        }
    };
    var chart = new google.visualization.ColumnChart(chartDiv);
    chart.draw(data, options);
}

function drawChartDonut(chartDiv, chartData) {
    var dataArray = [];
    dataArray.push(['Name', 'Value']);
    for (var i = 0; i < chartData.length; i++) {
        dataArray.push(['', chartData[i]]);
    }

    var data = new google.visualization.arrayToDataTable(dataArray);

    var fontSizeCurrent = 26;
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w < 1681) {
        fontSizeCurrent = 20;
    }

    var options = {
        legend: {position: 'none'},
        pieHole: 0.55,
        chartArea:{left: 0, top: 0, width: '100%', height: '100%'},
        enableInteractivity: false,
        titlePosition: 'none',
        pieSliceText: 'value',
        pieSliceTextStyle: {color: '#fff', fontName:'DINPro, sans-serif', fontSize:fontSizeCurrent},
        colors: chartColors,
        pieSliceBorderColor: 'transparent'
    };
    var chart = new google.visualization.PieChart(chartDiv);
    chart.draw(data, options);
}

function initForm(curForm) {
    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            if ($(form).hasClass('ajax-form')) {
                var formData = new FormData(form);
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'html',
                    data: formData,
                    cache: false
                }).done(function(html) {
                    curForm.addClass('with-results');
                    curForm.find('.footer-feedback-result').html(html);
                });
            } else {
                form.submit();
            }
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length > 0) {
        windowClose();
    }

    var curPadding = $('.wrapper').width();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});
    $('body').append('<div class="window"><div class="window-loading"></div></div>')

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        $('.window').append('<div class="window-container window-container-preload"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        if ($('.window .g-recaptcha').length > 0) {
            grecaptcha.render($('.window .g-recaptcha')[0], {
                'sitekey' : '6Ldk5DMUAAAAALWRTOM96EQI_0OApr59RQHoMirA'
            });
        }

        $('.window-company-revenue-graph').each(function() {
            var curGraph = $('.window-company-revenue-graph-inner');
            var dataArray = [];
            dataArray.push(['Name', 'Value', { role: 'annotation' }]);
            for (var i = 0; i < dataRevenue.length; i++) {
                dataArray.push([dataRevenue[i][0], dataRevenue[i][1], dataRevenue[i][2]]);
            }

            var data = google.visualization.arrayToDataTable(dataArray);

            var options = {
                legend: {position: 'none'},
                annotations: {
                    datum: {
                        stem: {
                            color: 'transparent'
                        }
                    },
                    highContrast: false,
                    textStyle: {
                        fontName: 'Roboto',
                        fontSize: 14,
                        color: '#ccc',
                        auraColor: 'transparent',
                    }
                },
                colors: ['#163072'],
                bar: {groupWidth: '90%'},
                axisTitlesPosition: 'none',
                enableInteractivity: false,
                chartArea:{left: 0, top: 0, width: '100%', height: '70%'},
                vAxis: {
                    baselineColor: '#c4c4c4',
                    gridlines: {color: '#fff'},
                    textPosition: 'none',
                    logScale: false
                },
                titlePosition: 'none',
                hAxis: {
                    baselineColor: '#c4c4c4',
                    textStyle:  {
                        fontName: 'Roboto',
                        fontSize: 16,
                        color: '#6d6d6d'
                    }
                }
            };
            var chart = new google.visualization.ColumnChart(curGraph[0]);
            chart.draw(data, options);
        });

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    windowPosition();
                    $('.window-container-preload').removeClass('window-container-preload');
                }
            });
        } else {
            windowPosition();
            $('.window-container-preload').removeClass('window-container-preload');
        }

        window.setTimeout(function() {
            if ($('.window-container-preload').length > 0) {
                windowPosition();
                $('.window-container-preload').removeClass('window-container-preload');
            }
        }, 5000);

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 120) {
            $('.window-container').css({'top': '60px', 'margin-top': 0, 'padding-bottom': '60px'});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
    }
}