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
            this.self = this;

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

    mMachinery.init = function () {

        // all init here
        mMachinery.page.init();
        mMachinery.navigation.init();

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