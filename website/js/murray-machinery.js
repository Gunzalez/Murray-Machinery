// JavaScript Document
(function ($, window) {

    var mMachinery = {};

    mMachinery.properties = {
        windowWidth: ''
    };

    mMachinery.page = {
        resize: function(){},
        init: function (){}
    };

    mMachinery.navigation = {

        // initial set up
        init: function(){

            // elements of this component
            this.$parentRow = $('.main-navigation');
            this.$menuToggleBtns = $('.has-menu', this.$parentRow);

            this.smallScreenMenu = $("#menu");
            this.$toggleBtn = $('.toggle-navigation', this.$parentRow);

            this.$menuToggleBtns.each(function(i, obj){
                $('> a', $(obj)).on('click', function(e){
                    e.preventDefault();
                    if(Modernizr.touch){
                        $(obj).siblings().removeClass('hover');
                        $(obj).toggleClass('hover');
                        $(obj).blur();
                    }
                });

                if(!Modernizr.touch){
                    $(obj).on('mouseenter', function(){
                        $(obj).addClass('hover');
                    });

                    $(obj).on('mouseleave', function(){
                        $(obj).removeClass('hover');
                    });
                }
            });

            this.smallScreenMenu.mmenu({
                offCanvas: {
                    position  : "right",
                    "zposition": "back"
                },
                "extensions": [
                    "theme-white",
                    //"pagedim-black",
                    "border-offset"
                ]
            });
            mMachinery.navigation.API = this.smallScreenMenu.data("mmenu");
            mMachinery.navigation.API.bind("opened", function() {
                mMachinery.navigation.$toggleBtn.addClass('is-active');
            });
            mMachinery.navigation.API.bind("closed", function() {
                mMachinery.navigation.$toggleBtn.removeClass('is-active');
            });

            this.$toggleBtn.on('click', function(e){
                e.preventDefault();
                mMachinery.navigation.API.open();
            });
        },

        resize: function(){
            // close/hide all menu on resize
            this.$menuToggleBtns.each(function(i, obj){
                $(obj).removeClass('hover');
            });
            mMachinery.navigation.API.close();
        }
    };

    mMachinery.carousel = {

        init: function(){

            this.$parent = $('.main-carousel');
            this.$slides = $('.slide');
            this.$controlBox = $('.slide-controls');
            this.$controls = $('.slide-controls a', this.$parent);

            this.delay = 7; // in seconds
            this.timer = null;
            var self = this;

            this.changeSlide = function(index){
                // hide/show slide copy
                self.$slides.removeClass('active');
                self.$slides.eq(index).addClass('active');
                // change slide back ground
                var newBg = self.$slides.eq(index).attr('data-slide-bg');
                self.$parent.css('background-image', 'url("'+newBg+'")');
                // update blue dots to reflect change
                self.$controls.removeClass('active');
                self.$controls.eq(index).addClass('active');
            };

            this.$controls.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    if(!$(obj).hasClass('active')){
                        var index = self.$controls.index($(obj));
                        self.changeSlide(index);
                        if(self.timer){
                            clearInterval(self.timer);
                        }
                    }
                });
            });

            this.timer = setInterval(function(){
                if(!self.$parent.is(":hover")){
                    var $activeLink = $('.active', self.$controlBox);
                    var activeIndex = self.$controls.index($activeLink);
                    var nextIndex = activeIndex + 1;
                    if(nextIndex == self.$controls.length){
                        nextIndex = 0
                    }
                    self.changeSlide(nextIndex);
                }
            }, (this.delay * 1000));
        }
    };

    mMachinery.init = function () {

        // all init here
        mMachinery.page.init();
        mMachinery.navigation.init();
        mMachinery.carousel.init();

        // resize triggers
        $(window).on('resize', function () {

            var newWidth = $(window).width(),
                oldWidth = mMachinery.properties.windowWidth;

            if (oldWidth != newWidth) {
                mMachinery.properties.windowWidth = newWidth;
                mMachinery.resize();
            }
        });

        // trigger initial resize, just to be sure
        mMachinery.resize();
        $(window).trigger('resize');
    };

    // main resize
    mMachinery.resize = function () {
        mMachinery.page.resize();
        mMachinery.navigation.resize();
    };

    // main init
    $(document).ready(function () {
        mMachinery.init();
    });

}(jQuery, window));