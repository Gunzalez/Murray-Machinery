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
            this.isOpen = false;
            var self = this;

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
                //self.$buttonsContainer.addClass('animate');
                if(!self.isOpen){
                    self.open();
                } else {
                    self.close();
                }
            });
        },

        // open menu
        open: function(){
            this.$parentRow.addClass('open');
            this.isOpen = true;
            this.$toggleBtn.addClass('is-active');
            //this.$buttonsContainer.height(this.$buttons.outerHeight());
        },

        // close navigation
        close: function(){
            this.$parentRow.removeClass('open');
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            //this.$buttonsContainer.removeAttr('style');
        },

        // rest navigation
        reset: function(){
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            //this.$buttonsContainer.removeClass('animate').removeAttr('style');
        },

        // close on resize
        resize: function(){
            this.reset();
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