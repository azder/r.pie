(function(GLOBAL, $, Raphael) {

    //
    'use strict';

    var pie = function(options) {


        var i,
        //
        rad = Math.PI / 180,
        //
        paper = this,
        //
        cx = ( options = options || {}).cx,
        //
        cy = options.cy,
        //
        r = options.r,
        //
        values = options.values || [],
        //
        labels = options.labels || [],
        //
        stroke = options.stroke,
        //
        full = !!options.full,
        //
        partial = !!options.partial,
        //
        count = values.length,
        //
        chart = paper.set(),
        //
        sector = function(cx, cy, r, startAngle, endAngle, params) {

            var
            //
            x1 = cx + r * Math.cos(-startAngle * rad),
            //
            x2 = cx + r * Math.cos(-endAngle * rad),
            //
            y1 = cy + r * Math.sin(-startAngle * rad),
            //
            y2 = cy + r * Math.sin(-endAngle * rad)
            //var
            ;
            return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);

        },
        //
        angle = 0,
        //
        total = 0,
        //
        colorStart = 0,
        //
        process = function(j) {

            var
            //
            value = values[j],
            //
            angleplus = 360 * value / total,
            //
            popangle = angle + (angleplus / 2),
            //
            whiteColor = (0 === j && (full || partial )),
            //
            color = ( whiteColor ? 'rgb(255,255,255)' : 'hsb(' + colorStart + ', 1, .5)'),
            //
            ms = 500,
            //
            delta = 30,
            //
            bcolor = ( whiteColor ? 'rgb(255,255,255)' : 'hsb(' + colorStart + ', 1, 1)'),
            //
            p = sector(cx, cy, r, angle, angle + angleplus, {
                gradient: "90-" + bcolor + "-" + color,
                stroke: stroke,
                "stroke-width": 3
            }),
            //
            txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({
                fill: bcolor,
                stroke: "none",
                opacity: 0,
                "font-family": 'Fontin-Sans, Arial',
                "font-size": "20px"
            });

            p.mouseover(function() {
                p.animate({
                    scale: [1.1, 1.1, cx, cy]
                }, ms, "elastic");
                txt.animate({
                    opacity: 1
                }, ms, "elastic");
            }).mouseout(function() {
                p.animate({
                    scale: [1, 1, cx, cy]
                }, ms, "elastic");
                txt.animate({
                    opacity: 0
                }, ms);
            });

            angle += angleplus;
            chart.push(p);
            chart.push(txt);

            if (!whiteColor) {
                colorStart += .1;
            };

        }

        //var
        ;

        for ( i = 0; i < count; i++) {
            total += values[i];
        }

        for ( i = 0; i < count; i++) {
            process(i);
        }

        return chart;

    };

    Raphael.fn.pieChart = function(options) {

        var i, paper = this, count = 0,
        //
        o = $.extend({}, options),
        //
        steps = options.steps || 10,
        //
        delay = options.delay || 50,
        //
        increments = [],
        //
        length = options.values.length,
        //
        repaint = function() {

            var i, size, all = 0, values = [], divider;

            count++;

            for ( i = 0; i < length; i++) {
                size = Math.ceil(increments[i] * count);
                values.push(size);
                all += size;
            }

            values.unshift(100 - all);
            o.values = values;

            pie.call(paper, o);

            if (count < steps) {
                GLOBAL.setTimeout(repaint, delay);
            } else {
                paper.clear();
                pie.call(paper, options);
            }

        }

        // var
        ;

        o.labels = [];
        o.partial = true;

        for ( i = 0; i < length; i++) {
            increments[i] = options.values[i] / steps;
        }

        paper.clear();
        repaint();


    };

})(this, jQuery, Raphael);

