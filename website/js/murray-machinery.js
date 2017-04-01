// JavaScript Document
(function ($, window) {

    var mMachinery = {};

    mMachinery.properties = {
        windowWidth: ''
    };

    mMachinery.utils = {};

    mMachinery.environment = {

        resize: function(){},

        init: function (){}

    };

    mMachinery.navigation = {

        // initial set up
        init: function(){

            // elements of this component
            this.$parentRow = $('.main-navigation');
            this.$menuToggleBtn = $('.has-menu', this.$parentRow);
            this.$toggleBtn = $('.toggle-navigation', this.$parentRow);

            this.$menuToggleBtn.each(function(i, obj){
                $('> a',$(obj)).on('click', function(e){
                    e.preventDefault();
                    if(Modernizr.touch){
                        $(obj).siblings().removeClass('hover');
                        $(obj).toggleClass('hover');
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

            this.$toggleBtn.on('click', function(e){
                e.preventDefault();
                $(this).blur().toggleClass('is-active');
                //alert('Monket')
            });
        },

        // close on resize
        resize: function(){
            this.$menuToggleBtn.each(function(i, obj){
                $(obj).removeClass('hover');
            });
        }
    };

    mMachinery.init = function () {

        // all init here
        mMachinery.environment.init();
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
        mMachinery.environment.resize();
        mMachinery.navigation.resize();
    };

    // main init
    $(document).ready(function () {
        mMachinery.init();
    });

}(jQuery, window));