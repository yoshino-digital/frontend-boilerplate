/** theme.js */

/**
 * Notes
 * =====
 * 
 * If you are building a rather simple project, put all your scripts inside this file.
 * 
 * If you are building a somewhat larger project, create individual files. They are
 * merged into a single file during the build-process.
 * 
 * You can use jQuery - it’s already included.
 */

$(function() {
    
    var $spark = $('<span style="display:block;background:#7b68b5;border-radius:50%;"></span>');
    
    function initSparkle() {
        
        var $target = $('[data-sparkle]');
    
        $target.each(function() {
        
            var $this = $(this);
            $this.css('position','relative');
            
            YOI.setInterval('delaySparkle', 200, function() {
                sparkle($this);
                sparkle($this);
                sparkle($this);
                sparkle($this);
            });
        
        });
        
    }
    
    function sparkle($target) {
        
        var posX     = 25;
        var posY     = 25;
        var diameter = Math.ceil(Math.random(1, 8) * 10);
        var destY    = Math.ceil(Math.random(1, 100));
        var destX    = Math.ceil(Math.random(1, 100));
        var offsetY  = Math.random() < 0.5 ? -100 * destY : 100 * destY;
        var offsetX  = Math.random() < 0.5 ? -100 * destX : 100 * destX;
        
        var $thisSpark = $spark.clone();
        
        $thisSpark.css({
            position : 'absolute',
            top      : posY,
            left     : posX,
            width    : diameter,
            height   : diameter
        });

        $target.append($thisSpark);

        $thisSpark.animate({
            width   : '9px',
            height  : '9px',
            opacity : 0,
            top     : offsetY,
            left    : offsetX
        }, 500, function() {
            $thisSpark.remove();
        });

    }
    
    initSparkle();

});