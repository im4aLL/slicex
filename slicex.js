/**
 * [SliceX - A javascript slider with tile / slice effect]
 * @author  Habib Hadi <me@habibhadi.com>
 *          Shishir Morshed <shishir.morshed@adpeople.com>
 * @company Graphicpeople <http://graphicpeoplestudio.com/>
 */
;(function (window, document, undefined) {
    'use strict';

    /**
     * [SliceX Slider class]
     * @param {[string]} elementId [ID name of a div or other]
     * @param {[json]} settings  [settings JSON]
     */
    function SliceX(elementId, settings){
        this.settings = settings || {};
        this.slider = document.getElementById(elementId);
        this.transition = this.settings.transition || 'rectleft';
        this.animationSpeed = this.settings.animationSpeed || 60;
        this.sliderTimeout = this.settings.sliderTimeout || 5000;
        this.init();
    }

    /**
     * [init Intializing]
     */
    SliceX.prototype.init = function(){
        this.sliderUtils();
        this.setSliderDimension();
        this.setTransitionMethod();
        this.calcSliceDimension();
        this.startSlider();
    };

    /**
     * [sliderUtils Storing global varibles for slider]
     * @return {[null]} []
     */
    SliceX.prototype.sliderUtils = function(){
        var _self = this;
        _self.slider.classList.add('slicex');
        _self.slides = _self.getChildrensByElement(_self.slider);
        _self.totalSlide = _self.slides.length;
    };

    /**
     * [setSliderDimension get slider width height]
     * @param {[number]} w [slider width]
     * @param {[number]} h [slider height]
     */
    SliceX.prototype.setSliderDimension = function(w, h){
        this.sliderWidth = w || this.slider.offsetWidth;
        this.sliderHeight = h || this.slider.offsetHeight;
    };

    /**
     * [setTransitionMethod Set a transition method]
     * @param {[string]} methodName [name of method]
     */
    SliceX.prototype.setTransitionMethod = function(methodName){
        var _self = this;
        _self.transition = methodName || _self.transition;
        _self.slice = _self.slice || {};

        _self.slice.x = 0;
        _self.slice.y = 0;

        switch(_self.transition) {
            case 'rectleft':
                _self.slice.x = 20;
                _self.slice.y = 10;
                _self.slice.shade = true;
            break;

            default:
                _self.slice.x = 20;
                _self.slice.y = 10;
        }
    };

    /**
     * [calcSliceDimension Calculate sliced part dimension]
     * @return {[null]} []
     */
    SliceX.prototype.calcSliceDimension = function(){
        var _self = this;

        _self.slice.height = _self.slice.y === 0 ? _self.sliderHeight : Math.round(_self.sliderHeight / _self.slice.y);
        _self.slice.width = _self.slice.x === 0 ? _self.sliderWidth : Math.round(_self.sliderWidth / _self.slice.x);
    };

    /**
     * [getChildrensByElement get child dom]
     * @param  {[object]} element [parent dom]
     * @return {[array]}         [array of dom element]
     */
    SliceX.prototype.getChildrensByElement = function(element){
        var childNodes = element.childNodes;
        var children = [];
        var i = childNodes.length;
        
        while (i--) {
            if (childNodes[i].nodeType == 1) {
                children.unshift(childNodes[i]);
            }
        }

        return children;
    };

    /**
     * [addSliceToSlide Adding sliced parts into slide element as adjusting background position with animation]
     * @param {[number]} i [no of slider]
     */
    SliceX.prototype.addSliceToSlide = function(i){
        var _self = this;
        var element = _self.slides[i];
        var s = {};

        element.classList.add('slicex-slide');
        s.img = element.querySelector('img').getAttribute('src');
        s.totalTile = _self.slice.x * _self.slice.y;

        var y = 1;
        var tile = '';
        for(var j = 1; j <= s.totalTile; j++ ) {
            var x = j % _self.slice.x === 0 ? _self.slice.x : j % _self.slice.x;
            var bgXpos = - ((x - 1) * _self.slice.width);
            var bgYpos = - ((y - 1) * _self.slice.height);
            var delayTime = _self.calcDelayTime(x, y, j);

            tile += '<div class="slicex-tile slicex-tile-x' + x + '-y' + y + ' fadeIn" style="height:' + _self.slice.height + 'px; width: ' + _self.slice.width + 'px; background-image: url(\'' + s.img + '\'); background-position: ' + bgXpos + 'px ' + bgYpos + 'px; animation-delay:'+ delayTime +'ms">';
            if(_self.slice.shade === true) {
                tile += '<div class="slicex-tile-inner" style="animation-delay:'+ (delayTime + (_self.animationSpeed / 2)) +'ms"></div>';
            }
            tile += '</div>';

            if( j > 1 && j % _self.slice.x === 0 ) {
                y++;
            }
        }

        element.innerHTML += '<div class="slicex-tiles">' + tile + '</div>';
    };

    /**
     * [calcDelayTime Calculate delaytime in terms of tile]
     * @param  {[number]} tileX       [tile / slice position according to X axis]
     * @param  {[number]} tileY       [tile / slice position according to Y axis]
     * @param  {[number]} currentTile [current tile / slice position]
     * @return {[number]}             [animatin speed time]
     */
    SliceX.prototype.calcDelayTime = function(tileX, tileY, currentTile){
        var _self = this;

        var totalY = _self.slice.y;
        var totalX = _self.slice.x;
        var totalTile = totalX * totalY;

        var result;
        if(_self.transition === 'rectleft'){
            result = (totalX - tileX) + ((totalTile - currentTile) / totalX);
        }
        else if(_self.transition === 'yleft') {
            result = totalX - tileX;
        }
        else if(_self.transition === 'yright') {
            result = tileX;
        }
        else if(_self.transition === 'xup') {
            result = totalY - tileY;
        }
        else if(_self.transition === 'xdown') {
            result = tileY;
        }

        return result * _self.animationSpeed;
    };

    /**
     * [startSlider Looping slide one by one]
     * @return {[null]} []
     */
    SliceX.prototype.startSlider = function(){
        var _self = this;

        for(var i = 0; i < _self.totalSlide; i++) {
            _self.addSliceToSlide(i);
        }

        _self.sliderCounter = 0;
        _self.slides[_self.sliderCounter].classList.add('is-played');

        _self.sliderTimer = setInterval(function(){
            _self.sliderCounter++;
            _self.slides[_self.sliderCounter].classList.add('is-played');

            if(_self.sliderCounter === (_self.totalSlide - 1)) {
                clearInterval(_self.sliderTimer);
            }
        }, _self.sliderTimeout);
    };

    window.SliceX = SliceX;
})(window, document);
