import {nextTick} from '../util/index';

export default function (UIkit) {

    UIkit.component('match-height', {

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: false,
            row: true
        },

        ready() {
            this.check();
        },

        update: {
            handler() {
                this.check();
            },
            on: ['resize', 'orientationchange', 'update']
        },

        methods: {

            check() {

                let elements = (this.target ? $(this.target, this.$el) : this.$el.children()).css('min-height', '');

                if (!this.row) {
                    this.match(elements);
                    return this;
                }

                elements.first().width(); // force redraw

                nextTick(() => {

                    var lastOffset = false, group = [];

                    elements.each((i, el) => {

                        el = $(el);

                        var offset = el.offset().top;

                        if (offset != lastOffset && group.length) {
                            this.match($(group));
                            group = [];
                            offset = el.offset().top;
                        }

                        group.push(el);
                        lastOffset = offset;
                    });



                    if (group.length) {
                        this.match($(group));
                    }

                });

                return this;
            },

            match(elements) {

                if (elements.length < 2) {
                    return;
                }

                var max = 0;

                elements
                    .each(function () {
                        max = Math.max(max, $(this).outerHeight());
                    })
                    .each(function () {
                        var el = $(this);
                        el.css('min-height', (max - (el.css('box-sizing') == 'border-box' ? 0 : (el.outerHeight() - el.height()))) + 'px');
                    });
            }

        }

    });

}
