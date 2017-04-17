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

    mMachinery.utils = {
        doAfterImagesLoaded: function(imgSrcArr, callback){
            var imagesToLoad = imgSrcArr;
            var cnt = imagesToLoad.length;
            var imagesLoaded = 0;

            var loadAllImages = function(){
                var img = new Image();
                $(img).load(function(){
                    imagesLoaded++;
                    if(imagesLoaded === cnt){
                        callback();
                    } else {
                        // recursive
                        loadAllImages();
                    }
                }).attr('src',imagesToLoad[imagesLoaded]);
            };
            loadAllImages();
        }
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
                    "position"  : "right",
                    "zposition": "back"
                },
                "extensions": [
                    "theme-white",
                    //"theme-dark",
                    "pagedim-black",
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

        changeSlide: function(index){

            // hide/show slide copy
            this.$slides.removeClass('active');
            this.$slides.eq(index).addClass('active');

            // change slide back ground image
            var newBg = this.$slides.eq(index).attr('data-slide-bg');
            this.$parent.css('background-image', 'url("'+newBg+'")');

            // update blue dots to reflect change
            this.$controls.removeClass('active');
            this.$controls.eq(index).addClass('active');
        },

        init: function(){
            this.$parent = $('.main-carousel');
            this.$slides = $('.slide');
            this.$controlBox = $('.slide-controls');
            this.$controls = $('.slide-controls a', this.$parent);

            this.delay = 7; // in seconds
            this.timer = null;
            var self = this;

            // create src array of images to be loaded
            var imagesToLoad = [];
            this.$slides.each(function (i, obj) {
                imagesToLoad.push($(obj).attr('data-slide-bg'))
            });

            // create callback to be called after images are loaded
            var callback = function(){
                // attach carousel controls events
                self.$controls.each(function(i, obj){
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

                // set up carousel timer
                self.timer = setInterval(function(){
                    if(!self.$parent.is(":hover")){
                        var $activeLink = $('.active', self.$controlBox);
                        var activeIndex = self.$controls.index($activeLink);
                        var nextIndex = activeIndex + 1;
                        if(nextIndex === self.$controls.length){
                            nextIndex = 0
                        }
                        self.changeSlide(nextIndex);
                    }
                }, (self.delay * 1000));

                // display carousel controls
                self.$controlBox.removeClass('controls-not-ready');
            };

            // pass array, callback to preLoading function
            mMachinery.utils.doAfterImagesLoaded(imagesToLoad, callback);
        }
    };

    mMachinery.views = {
        init: function () {
            this.listOfOtherViewPods = $('.with-other-views');
            this.listOfOtherViewPods.each(function (i, obj) {
                var $mainView = $('.main-view', $(obj)),
                    $otherViews = $('.other-views', $(obj));

                $('a', $otherViews).on('click', function (e) {
                    e.preventDefault();
                    $mainView.attr('src', $('img',$(this)).attr('src'));
                });
            })
        }
    };

    mMachinery.timed = {

        changeSlide: function () {
            var $activeSlide = $('.active', this.$stage);
            var currIndex = this.$slides.index($activeSlide);

            this.$slides.removeClass('active');
            currIndex++;
            if(currIndex === this.$slides.length){
                currIndex = 0;
            }

            var $newActiveSlide = $(this.$slides[currIndex]).addClass('active');
            this.$stage.css('background-image', 'url("' + $newActiveSlide.attr('src') + '")');
        },

        init: function () {
            this.$stage = $('#timed-carousel');
            this.$slides = $('.slide', this.$stage);
            this.$progressBar = $('.slide-progress-bar', this.$stage);
            this.delay = 30; // 30 seconds
            this.timer = null;

            var self = this;
            if(this.$slides.length > 1) {

                // create src array of images to be loaded
                var imagesToLoad = [];
                this.$slides.each(function (i, obj) {
                    imagesToLoad.push($(obj).attr('src'))
                });

                // create callback to be called after images are loaded
                var callback = function () {

                    var $slideProgress = $('<div />');
                    self.$progressBar.append($slideProgress);

                    $slideProgress.css('transition-duration', self.delay + 's');
                    $slideProgress.get(0).addEventListener('transitionend', function () {
                        self.changeSlide();
                        if($slideProgress.width() === 0){
                            $slideProgress.width('100%');
                        } else {
                            $slideProgress.width('0%');
                        }
                    });
                    self.$progressBar.removeClass('display-none');
                    $slideProgress.width('0%');
                };

                // pass array, callback to preloading function
                mMachinery.utils.doAfterImagesLoaded(imagesToLoad, callback);
            }
        }
    };

    mMachinery.filter = {

        toggle: function () {            
            if(this.state === 'feature'){
                this.$container.height(this.$feature.height());
                this.$feature.removeClass('static');
                this.$container.height(0); 
                this.state = 'filter';
            } else {
                this.$container.height(this.$filter.height());
                this.$filter.removeClass('static');
                this.$container.height(0);
                this.state = 'feature';
            }
        },

        transitionEnded: function() {
            if(this.$container.height() === 0){
                if(this.state === 'filter'){
                    this.$feature.removeClass('visible');
                    this.$filter.addClass('visible');
                    this.$container.height(this.$filter.height());
                    this.$switcher.addClass('filter').removeClass('feature');
                } else {
                    this.$filter.removeClass('visible');
                    this.$feature.addClass('visible');
                    this.$container.height(this.$feature.height());
                    this.$switcher.removeClass('filter').addClass('feature');
                }
            } else {
                if(this.$filter.height() === this.$container.height()){
                    this.$filter.addClass('static');
                    this.$container.removeAttr('style');
                } else if(this.$feature.height() === this.$container.height()){
                    this.$feature.addClass('static');
                    this.$container.removeAttr('style');
                }
            }
        },

        init: function () {
            this.$filter = $('#product-filter');
            this.$feature = $('#product-feature');
            this.$switcher = $('#feature-filter-switcher');
            this.$container = $('#container-product-filter');
            this.state = 'feature';

            var self = this;
            if(this.$container.length > 0){
                this.$container.get(0).addEventListener('transitionend', function () {
                    self.transitionEnded();
                });

                this.$switcher.on('click', function (e) {
                    e.preventDefault();
                    self.toggle();
                    $(this).blur();
                });
            }
        }

    };

    mMachinery.init = function () {

        // all init here
        mMachinery.page.init();
        mMachinery.navigation.init();
        mMachinery.carousel.init();
        mMachinery.filter.init();
        mMachinery.views.init();
        mMachinery.timed.init();

        // resize triggers
        $(window).on('resize', function () {

            var newWidth = $(window).width(),
                oldWidth = mMachinery.properties.windowWidth;

            if (oldWidth !== newWidth) {
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