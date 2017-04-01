// JavaScript Document
(function ($, window) {

    var mMachinery = {};

    mMachinery.properties = {
        windowWidth: '',
        isMobile: false
    };

    mMachinery.utils = {

        // checks based on CSS class
        mobileCheck: function() {
            var rtnVal = false;
            if($('html').hasClass('mobile')){
                rtnVal = true;
            }
            return rtnVal;
        }
    };

    mMachinery.environment = {

        // globally used functions
        $displayToggles: $('.js-toggle-display'), // show/hide
        $toolTips: $('[data-toggle="tooltip"]'),  // tool tips
        $inputPods: $('.input-group-pod'),
        $datePickers: $('.datepicker'),
        $datePickersList: [],

        resize: function(){},

        init: function (){
            // check for mobile
            if (mMachinery.utils.mobileCheck()){
                mMachinery.properties.isMobile = true;
            }

            // shout out to http://amsul.ca/pickadate.js
            if(this.$datePickers.length > 0){
                this.$datePickers.each(function(i, obj){
                    var picker = $(obj).pickadate({
                        formatSubmit: 'yyyy/mm/dd',
                        //min: [2017, 2, 31], // stop dates in the past
                        //max: [2017, 2, 31], // stop dates in the future
                        container: 'body',
                        closeOnSelect: false,
                        closeOnClear: false,
                        close: 'Done'
                    });
                    mMachinery.environment.$datePickersList.push(picker);
                });
            }

            // cosmetic helper, put focus on input field
            this.$inputPods.each(function(i, obj){
                $('.symbol', $(obj)).on('click', function(){
                   // $('input', $(obj)).trigger('focus');
                });
            });

            // displays tooltips (bootstrap tooltips)
            if(this.$toolTips.length > 0){
                this.$toolTips.each(function(i, obj){
                    $(obj).on('click', function(e){
                        e.preventDefault();
                    })
                });
                this.$toolTips.tooltip();
            }

            // displays of divs (toggles)
            this.$displayToggles.each(function(i, obj){
                $(obj).on('click', function(){
                    var toggleTargetId = $(this).attr('data-toggle-display'),
                        $toggleTarget = $('#'+toggleTargetId),
                        isChecked = $(this).prop("checked");

                    if(isChecked){
                        $toggleTarget.addClass('display-none');
                    } else {
                        $toggleTarget.removeClass('display-none');
                    }
                })
            });
        }
    };

    mMachinery.login = {

        // initial set up
        init: function(){

            // assign variables
            this.$parentRow = $('.header-login');
            this.$openBtn = $('.toggle-btn', this.$parentRow);
            this.$loginFrm = $('.login-form', this.$parentRow);
            mMachinery.login.delayedClose = null;

            // attach open action
            var self = this;
            this.$openBtn.on('click', function(e){
                e.preventDefault();
                if(!self.$parentRow.hasClass('open')){
                    self.openFrm();
                } else {
                    self.closeFrm();
                }
            });

            // delay hiding menu after 3 seconds mouseleave
            this.$parentRow.on('mouseleave', function(){
                self.delayedClose = setTimeout(function(){
                    if(!self.$parentRow.is(":hover")){
                        self.closeFrm();
                    } else {
                        clearInterval(self.delayedClose);
                    }
                }, 3000);
            })
        },

        // open action
        openFrm: function(){
            var newHeight = this.$loginFrm.outerHeight() +  this.$parentRow.height();
            this.$parentRow.css('height', newHeight);
            this.$parentRow.addClass('open');

            // if Main Navigation is open, close it first
            if(mMachinery.navigation.isOpen){
                mMachinery.navigation.$toggleBtn.trigger('click');
            }
        },

        // close action
        closeFrm: function(){
            this.$parentRow.removeAttr('style');
            this.$parentRow.removeClass('open');
        },

        // close on resize
        resize: function(){
            this.closeFrm();
        }
    };

    mMachinery.overlay = {

        init: function () {

            $('.open-modal').on('click', function (e) {
                e.preventDefault();
                mMachinery.overlay.showOverlay();
            });

            $('.hide-modal').on('click', function (e) {
                e.preventDefault();
                mMachinery.overlay.hideOverlay();
            });
        },


        showOverlay:function(){
            $('#mMachinery-overlay').css('height', '100%');
        },

        hideOverlay: function(){
            $('#mMachinery-overlay').css('height', '0');
        }
    };

    mMachinery.navigation = {

        // initial set up
        init: function(){

            // elements of this component
            this.$parentRow = $('.header-title');
            this.$toggleBtn = $('.toggle-navigation', this.$parentRow);
            this.$buttonsContainer = $('.main-navigation', this.$parentRow);
            this.$buttons = $('.header-links', this.$parentRow);
            this.isOpen = false;
            var self = this;


            this.$toggleBtn.on('click', function(e){
                e.preventDefault();
                self.$buttonsContainer.addClass('animate');
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
            this.$buttonsContainer.height(this.$buttons.outerHeight());
        },

        // close navigation
        close: function(){
            this.$parentRow.removeClass('open');
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            this.$buttonsContainer.removeAttr('style');
        },

        // rest navigation
        reset: function(){
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            this.$buttonsContainer.removeClass('animate').removeAttr('style');
        },

        // close on resize
        resize: function(){
            this.reset();
        }
    };

    mMachinery.productsLists = {

        init: function(){
            // instantiate and assign variables
            this.$list = $('.products-list');
            this.$titles = $('.list-title', this.$list);
            this.$navbar = $('.products-navigation');
            this.$buttons = $('a', this.$navbar);
            var productsList = this;

            this.$titles.each(function(i, obj){
                $(obj).on('click', function(){
                    var index = productsList.$titles.index($(obj));
                    productsList.setPosition(index);
                })
            });

            this.$buttons.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    var index = productsList.$buttons.index($(obj));
                    productsList.setPosition(index);
                })
            });
        },

        setPosition: function(position){
            // controls buttons
            this.$buttons.parents('li').removeClass('active');
            this.$buttons.eq(position).parents('li').addClass('active');

            // controls header and copy display
            this.$list.removeClass('active');
            this.$list.eq(position).addClass('active');

            // scroll to header if visible
            if(this.$navbar.css('display') === 'none'){
                $('html, body').animate({
                    scrollTop: this.$list.eq(position).offset().top
                }, 500);
            }
        }
    };

    mMachinery.productImageSwitcher = {

        init: function(){
            // elements for this component
            this.$parent = $('.product-detail');
            this.$miniCarousel = $('.product-image-carousel', this.$parent);
            
            this.$miniCarousel.each(function(i, obj){
                var $buttons = $('[data-image-target]', $(obj));
                $buttons.on('click', function(e){
                    e.preventDefault();
                    var $targetImage = $('.' + $(this).attr('data-image-target'));
                    var imagePath = $('img', $(this)).attr('src');
                    var imageAlt = $('img', $(this)).attr('alt');
                    $targetImage.attr('src', imagePath);
                    $targetImage.attr('alt', imageAlt);
                    $buttons.removeClass('active');
                    $(this).addClass('active');
                });
            });
        }
    };

    mMachinery.FAQs = {
        init: function(){
            this.buttons = $('.faqs-list a').not('.questions a');
            this.buttons.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    var $parentLi = $(obj).parent();
                    if(!$parentLi.hasClass('active')){
                        $parentLi.addClass('active').find('> a i').removeClass('fa-caret-right').addClass('fa-caret-down');
                        $parentLi.siblings().removeAttr('class').find('> a i').addClass('fa-caret-right').removeClass('fa-caret-down');
                    } else {
                        $parentLi.removeAttr('class').find('> a i').addClass('fa-caret-right').removeClass('fa-caret-down');
                    }
                })
            });
        }
    };

    mMachinery.buttonToggles = {
        init: function(){
            this.buttons = $('[data-btn-state]');
            this.buttons.each(function(i, obj){
                $(obj).on('click', function(){
                    var state = $(obj).attr('data-btn-state');
                    if(state == 'positive'){
                        $(obj).attr('data-btn-state', 'negative');
                    } else {
                        $(obj).attr('data-btn-state', 'positive');
                    }
                    $(obj).blur();
                })
            })
        }
    };

    mMachinery.init = function () {

        // all init here
        mMachinery.environment.init();
        mMachinery.login.init();
        mMachinery.navigation.init();
        mMachinery.productsLists.init();
        mMachinery.productImageSwitcher.init();
        mMachinery.buttonToggles.init();
        mMachinery.overlay.init();
        mMachinery.FAQs.init();

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
        mMachinery.login.resize();
        mMachinery.navigation.resize();
    };

    // main init
    $(document).ready(function () {
        mMachinery.init();
    });

}(jQuery, window));