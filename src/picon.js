/**
 * picon
 * 2023(C)Tetsuaki BABA
 */
picon_defaults = {
    clock: {
        hour: 19,
        minute: 0,
    },
    battery: {
        percentage: 86,
        show_value: false,
    },
    calendar: {
        text: '26',
    },
    badge: {
        text: 'RR',
    },
    circle: {
        text: 'Z'
    },
    arrow: {
        angle: 153,
        surround: 'none',
        type: 'normal',
    },
    filetype: {
        text: 'DBZ',
    },
    volume: {
        value: 100,
    },
    chat: {
        angle: -51,
        text: 'ZZ..'
    },
    person: {
        size: 84,
        text: 'Smith'
    },
    compass: {
        angle: -30
    }

}
class picon {
    constructor(dom_key, name, options = {}) {
        let element = document.querySelector(dom_key);
        this.fontsize = parseInt(window.getComputedStyle(element).getPropertyValue('font-size'));
        this.color = window.getComputedStyle(element).getPropertyValue('color');
        this.size = {}
        this.size.w = this.fontsize;
        this.size.h = this.fontsize;
        this.line_width = this.fontsize * 0.06;
        this.name = name;
        this.is_clipping = false;
        if (name === 'clock') {
            // optionが全く定義されていない
            if (typeof options.clock === 'undefined') {
                options.clock = {};
                options.clock.hour = picon_defaults.clock.hour;
                options.clock.minute = picon_defaults.clock.minute;
            }
            // optionが一部でも定義されている
            else {
                if (typeof options.clock.hour === 'undefined') options.clock.hour = picon_defaults.clock.hour;
                if (typeof options.clock.minute === 'undefined') options.clock.minute = picon_defaults.clock.minute;
            }
            this.createSVGClock(dom_key, options);

        }
        else if (name === 'battery') {
            if (typeof options.battery != 'undefined') {
                if (typeof options.battery.percentage === 'undefined') options.battery.percentage = picon_defaults.battery.percentage;
                if (typeof options.battery.show_value === 'undefined') options.battery.show_value = picon_defaults.battery.show_value;
            }
            this.createSVGbattery(dom_key, options);
        }
        else if (name === 'calendar') {
            if (typeof options.calendar != 'undefined') {
                if (typeof options.calendar.text === 'undefined') options.calendar.text = picon_defaults.calendar.text;
            }
            this.createSVGCalendar(dom_key, options);
        }
        else if (name === 'badge') {
            if (typeof options.badge != 'undefined') {
                if (typeof options.badge.text === 'undefined') options.badge.text = picon_defaults.badge.text;
            }
            this.createSVGBadge(dom_key, options);
        }
        else if (name === 'circle') {
            if (typeof options.circle != 'undefined') {
                if (typeof options.circle.text === 'undefined') options.circle.text = picon_defaults.circle.text;
            }
            this.createSVGCircle(dom_key, options);
        }
        else if (name === 'arrow') {
            if (typeof options.arrow != 'undefined') {
                if (typeof options.arrow.angle === 'undefined') options.arrow.angle = picon_defaults.arrow.angle;
            }
            this.createSVGArrow(dom_key, options);
        }
        else if (name === 'filetype') {
            if (typeof options.filetype != 'undefined') {
                if (typeof options.filetype.text === 'undefined') options.filetype.text = picon_defaults.filetype.text;
            }
            this.createSVGFiletype(dom_key, options);
        }
        else if (name === 'volume') {
            if (typeof options.volume != 'undefined') {
                if (typeof options.volume.value === 'undefined') options.volume.value = picon_defaults.volume.value;
            }
            this.createSVGVolume(dom_key, options);
        }
        else if (name === 'chat') {
            if (typeof options.chat != 'undefined') {
                if (typeof options.chat.angle === 'undefined') options.chat.angle = picon_defaults.chat.angle;
                if (typeof options.chat.text === 'undefined') options.chat.text = picon_defaults.chat.text;
            }
            this.createSVGChat(dom_key, options);
        }
        else if (name === 'person') {
            if (typeof options.person != 'undefined') {
                if (typeof options.person.text === 'undefined') options.person.text = picon_defaults.person.text;
                if (typeof options.person.size === 'undefined') options.person.size = picon_defaults.person.size;
            }
            this.createSVGPerson(dom_key, options);
        }
        else if (name === 'compass') {
            if (typeof options.compass != 'undefined') {
                if (typeof options.compass.angle === 'undefined') options.compass.angle = picon_defaults.compass.angle;
            }
            this.createSVGCompass(dom_key, options);
        }
    }

    createSVGClock(dom_key, options = {}) {
        let h_length = this.size.w * 0.18;
        let m_length = this.size.w * 0.27;
        let h = options.clock.hour;
        let m = options.clock.minute;
        let clock = {
            h: {
                x: h_length * Math.cos(2 * Math.PI * (((h - 3) % 12) / 12)),
                y: h_length * Math.sin(2 * Math.PI * (((h - 3) % 12) / 12))
            },
            m: {
                x: m_length * Math.cos(2 * Math.PI * (((m - 15) % 60) / 60)),
                y: m_length * Math.sin(2 * Math.PI * (((m - 15) % 60) / 60))
            }
        }

        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        this.ellipse(this.size.w / 2, this.size.h / 2,
            this.size.w / 2 - this.line_width / 2, this.size.h / 2 - this.line_width / 2);
        this.line(this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.h.x,
            this.size.h / 2 + clock.h.y)
        this.line(
            this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.m.x,
            this.size.h / 2 + clock.m.y)
    }
    createSVGbattery(dom_key, options = {}) {
        let percentage = parseInt(options.battery.percentage) / 100;
        if (percentage < 0.0) percentage = 0.0;
        if (percentage > 1.0) percentage = 1.0;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));

        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        // frame of battery
        this.rect(this.line_width * 0.5, this.size.h * 0.25,
            this.size.w - this.line_width * 1.5, 0.5 * this.size.h);

        // value of battery
        this.rect(this.line_width, this.size.h * 0.25,
            (this.size.w - this.line_width * 2.5) * percentage, 0.5 * this.size.h, { fill: this.color, stroke_width: 0.5, rx: 0, ry: 0 })

        // +
        this.line(this.size.w - this.line_width * 0.5, this.size.h * 0.42,
            this.size.w - this.line_width * 0.5, this.size.h * 0.58);
        if (options.battery.show_value) {
            this.text(options.battery.percentage, this.size.w / 2, this.size.h * 0.68,
                { color: '#777777' }
            );
        }
        console.log(options.battery);
    }
    createSVGCalendar(dom_key, options = {}) {
        let text = options.calendar.text;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';

        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));

        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.rect(
            this.line_width * 0.5, this.line_width * 1.0,
            this.size.w - this.line_width, this.size.h - this.line_width * 1.5
        );

        this.rect(
            this.line_width * 0.5, this.line_width * 1.0,
            this.size.w - this.line_width, this.line_width * 1.5
        );

        this.line(this.size.w * 0.25,
            this.line_width * 1.0,
            this.size.w * 0.25,
            this.line_width * 0.5);
        this.line(this.size.w * 0.75,
            this.line_width * 1.0,
            this.size.w * 0.75,
            this.line_width * 0.5);

        this.text(text, this.size.w / 2, this.size.h * 0.70)
    }

    createSVGBadge(dom_key, options = {}) {

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.rect(this.line_width * 0.5, this.size.h * 0.2,
            this.size.w - this.line_width * 1.0, 0.6 * this.size.h);
        this.text(options.badge.text, this.size.w / 2, this.size.h * 0.68);
    }

    createSVGCircle(dom_key, options = {}) {

        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });
        this.ellipse(
            this.size.w / 2, this.size.h / 2,
            (this.size.w - this.line_width) / 2, (this.size.h - this.line_width) / 2
        );
        this.text(options.circle.text, this.size.w / 2, this.size.h * 0.68)
    }
    createSVGArrow(dom_key, options = {}) {

        let angle = -1 * parseFloat(options.arrow.angle);
        let r = this.size.w * 0.5 - this.line_width * 2.5;
        let l = r; // length of arrow 
        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        if (options.arrow.type == 'normal') {
            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)))

            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) * -1,
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) * -1)

            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            )
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle))
            )
        }
        else if (options.arrow.type == 'chevron') {
            r *= 0.5;
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            );
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle)));
        }


        if (options.arrow.surround == 'none') {

        }
        else if (options.arrow.surround == 'circle') {
            this.ellipse(
                this.size.w / 2, this.size.h / 2,
                (this.size.w - this.line_width) / 2, (this.size.h - this.line_width) / 2
            );
        }
        else if (options.arrow.surround == 'square') {
            this.rect(
                this.line_width * 0.5, this.line_width * 0.5,
                this.size.w - this.line_width, this.size.h - this.line_width
            );
        }
    }

    createSVGFiletype(dom_key, options = {}) {

        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        // this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.path(
            `
            M ${this.size.w / 8},${this.line_width * 2.0} 
            L ${this.size.w / 8},${this.size.h - this.line_width * 2.0} 
            Q ${this.size.w / 8},${this.size.h - this.line_width * 0.5},
              ${this.size.w / 8 + this.line_width * 2.0},${this.size.h - this.line_width * 0.5} 
            L ${this.size.w * (7 / 8) - this.line_width * 2.0},${this.size.h - this.line_width * 0.5} 
            Q ${this.size.w * (7 / 8)},${this.size.h - this.line_width * 0.5},
              ${this.size.w * (7 / 8)},${this.size.h - this.line_width * 2.0} 
            L ${this.size.w * (7 / 8)},${this.line_width * 4.0} 
            L ${this.size.w * (7 / 8) - this.line_width * 4.0},${this.line_width * 0.5} 
            L ${this.size.w / 8 + this.line_width * 1.5},${this.line_width * 0.5} 
            Q ${this.size.w / 8},${this.line_width * 0.5},
              ${this.size.w / 8},${this.line_width * 2.0}
            `
        );
        this.path(
            `
            M ${this.size.w * (7 / 8)},${this.line_width * 4.0}
            L ${this.size.w * (7 / 8) - this.line_width * 2.5},${this.line_width * 4.0}
            Q ${this.size.w * (7 / 8) - this.line_width * 4.0},${this.line_width * 4.0}
              ${this.size.w * (7 / 8) - this.line_width * 4.0},${this.line_width * 2.5}
            L ${this.size.w * (7 / 8) - this.line_width * 4.0},${this.line_width * 0.5}
            `,
            { fill: this.color }
        )
        this.text(options.filetype.text, this.size.w / 2, this.size.h * 0.6,
            {
                font_size: this.fontsize * 0.2
            }
        )

    }
    createSVGArrow(dom_key, options = {}) {
        let angle = -1 * parseFloat(options.arrow.angle);
        let r = this.size.w * 0.5 - this.line_width * 2.5;
        let l = r; // length of arrow 
        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        if (options.arrow.type == 'normal') {
            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)))

            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) * -1,
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) * -1)

            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            )
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle))
            )
        }
        else if (options.arrow.type == 'chevron') {
            r *= 0.5;
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            );
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle)));
        }


        if (options.arrow.surround == 'none') {

        }
        else if (options.arrow.surround == 'circle') {
            this.ellipse(
                this.size.w / 2, this.size.h / 2,
                (this.size.w - this.line_width) / 2, (this.size.h - this.line_width) / 2
            );
        }
        else if (options.arrow.surround == 'square') {
            this.rect(
                this.line_width * 0.5, this.line_width * 0.5,
                this.size.w - this.line_width, this.size.h - this.line_width
            );
        }
    }



    createSVGVolume(dom_key, options = {}) {
        let volume = parseInt(options.volume.value);
        if (volume > 99) volume = 99;
        if (volume < 0) volume = 0;
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        // horn
        this.path(
            `
            M ${this.line_width * 0.5}, ${this.size.h * (6 / 16) + this.line_width} 
            L ${this.line_width * 0.5}, ${this.size.h * (10 / 16) - this.line_width} 
            Q ${this.line_width * 0.5}, ${this.size.h * (10 / 16)},
              ${this.line_width * 1.5}, ${this.size.h * (10 / 16)} 
            L ${this.size.w * 0.25}, ${this.size.h * (10 / 16)}
            Q ${this.size.w * 0.45}, ${this.size.h * (13 / 16)},
              ${this.size.w * 0.45}, ${this.size.h * (12 / 16)}
            L ${this.size.w * 0.45}, ${this.size.h * (4 / 16)}
            Q ${this.size.w * 0.45}, ${this.size.h * (3 / 16)},
              ${this.size.w * 0.25}, ${this.size.h * (6 / 16)}
            L ${this.line_width * 1.0}, ${this.size.h * (6 / 16)}
            Q ${this.line_width * 0.5}, ${this.size.h * (6 / 16)},
              ${this.line_width * 0.5}, ${this.size.h * (6 / 16) + this.line_width}
            `
        );

        // show mute mark
        if (volume <= 0) {
            this.line(
                this.size.w * 0.65, this.size.h * (6 / 16),
                this.size.w * 0.90, this.size.h * (10 / 16)
            );
            this.line(
                this.size.w * 0.65, this.size.h * (10 / 16),
                this.size.w * 0.90, this.size.h * (6 / 16)
            );
        }


        // volume 
        for (let step = 0; step < volume / 33; step++) {
            let sv = volume % 33;
            if (step == parseInt(volume / 33)) {
                this.arc(this.size.w * 0.4, this.size.h / 2, this.size.w * (0.25 + 0.15 * step),
                    45 * sv / 33, -45 * sv / 33);
            }
            else {
                this.arc(this.size.w * 0.4, this.size.h / 2, this.size.w * (0.25 + 0.15 * step),
                    45, -45);
            }
        }
    }

    createSVGChat(dom_key, options = {}) {
        let angle = -1 * parseInt(options.chat.angle);
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));

        let r = 0.8 * this.size.w / 2 - this.line_width * 0.5;

        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });
        let str = this.arc(this.size.w / 2, this.size.h / 2, r, 10, -10, { large: 1, draw: false }).getD();
        str += ` L ${this.size.w - this.line_width * 0.5}, ${this.size.h / 2} Z`
        let e = document.createElementNS("http://www.w3.org/2000/svg", 'path');

        e.setAttribute('d', str);
        e.setAttribute('fill', 'transparent');
        e.setAttribute('stroke', `${this.color}`);
        e.setAttribute('stroke-width', `${this.line_width}`);
        e.setAttribute('cx', `${this.size.w / 2}`)
        e.setAttribute('cy', `${this.size.h / 2}`)
        e.setAttribute('transform-origin', `center`)
        e.setAttribute('transform', `rotate(${angle})`)
        this.svg.appendChild(e);

        this.text(options.chat.text, `${this.size.w / 2}`, `${this.size.h * 0.61}`,
            { font_size: this.fontsize * 0.3 })
    }
    createSVGPerson(dom_key, options = {}) {
        if (options.person.size <= 0) options.person.size = 1;
        if (options.person.size >= 120) options.person.size = 120;

        let size = parseInt(options.person.size) / 100;
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.ellipse(
            this.size.w * (8 / 16), this.size.h * (6 / 16),
            this.size.w * 0.22, this.size.h * 0.22,
            {
                transform: `scale(${size})`,
                transform_origin: 'bottom'
            }
        )
        this.path(`
                M ${this.size.w / 2}, ${this.size.h - this.line_width * 0.5}
                L ${this.line_width * 0.5}, ${this.size.h - this.line_width * 0.5}
                Q ${this.line_width * 0.5}, ${this.size.h * (11 / 16)},
                  ${this.size.w / 2}, ${this.size.h * (11 / 16)}
                Q ${this.size.w - this.line_width * 0.5}, ${this.size.h * (11 / 16)},
                  ${this.size.w - this.line_width * 0.5}, ${this.size.h - this.line_width * 0.5}
                L ${this.size.w / 2}, ${this.size.h - this.line_width * 0.5}
                `,
            {
                transform: `scale(${size})`,
                transform_origin: 'bottom'
            }
        );
        this.text(options.person.text, this.size.w / 2, this.fontsize * 0.2,
            { font_size: this.fontsize * 0.2 });
    }


    createSVGCompass(dom_key, options = {}) {
        let angle = -1 * parseInt(options.compass.angle);
        let r = this.size.w * 0.5 - this.line_width * 1;
        let r2 = this.size.w * 0.5 - this.line_width * 3.5;
        let l = r; // length of arrow 
        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.ellipse(this.size.w / 2, this.size.h / 2, r, r);
        this.path(
            `
            M ${this.size.w / 2}, ${this.size.h / 2 + r - this.line_width * 1.5}
            L ${this.size.w * (10 / 16)}, ${this.size.h / 2}
            L ${this.size.w * (8 / 16)}, ${this.size.h / 2 - r + this.line_width * 1.5}
            L ${this.size.w * (6 / 16)}, ${this.size.h / 2}
            L ${this.size.w / 2}, ${this.size.h / 2 + r - this.line_width * 1.5}
            Z
            `,
            {
                transform: `rotate(${angle})`
            }
        );
        this.path(
            `
            M ${this.size.w * (8 / 16)}, ${this.size.h / 2 - r + this.line_width * 1.5}
            L ${this.size.w * (6 / 16)}, ${this.size.h / 2}
            L ${this.size.w * (10 / 16)}, ${this.size.h / 2}
            Z            
            `,
            { stroke_width: 0, fill: this.color, transform: `rotate(${angle})` }
        );
    }


    /**
     * 
     * @param {int} degrees convert degrees to radians
     * @returns 
     */
    d2r(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }

    /**
     * 
     * @param {float} x LEFT point to draw
     * @param {float} y TOP point to draw
     * @param {float} w Width of the rectangle
     * @param {float} h Height of the rectangle
     * @param {object} options stroke_width, stroke, fill, rx, ry
     */
    rect(x, y, w, h,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
            rx: this.line_width, ry: this.line_width,
            clip: false
        }) {
        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.rx === 'undefined') options.rx = this.line_width;
        if (typeof options.ry === 'undefined') options.ry = this.line_width;
        if (typeof options.clip === 'undefined') options.clip = false;
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;

        let e = document.createElement('rect');
        e.setAttribute('x', x);
        e.setAttribute('y', y);
        e.setAttribute('width', w);
        e.setAttribute('height', h);
        //e.setAttribute('stroke', options.stroke);
        //e.setAttribute('fill', options.fill);
        //e.setAttribute('stroke-width', options.stroke_width);
        //e.setAttribute('rx', options.rx);
        //e.setAttribute('ry', options.ry);
        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.innerHTML += `<rect x="${x}" y = "${y}" width="${w}" height="${h}" stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" rx="${options.rx}" ry="${options.ry}" ${str_clip_path}/>`;
        }

    }
    ellipse(x, y, w, h,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
        }) {
        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.clip === 'undefined') options.clip = false;
        if (typeof options.transform_origin === 'undefined') options.transform_origin = 'center';
        if (typeof options.transform === 'undefined') options.transform = '';
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;

        let e = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
        e.setAttribute('cx', x);
        e.setAttribute('cy', y);
        e.setAttribute('rx', w);
        e.setAttribute('ry', h);
        e.setAttribute('stroke', options.stroke);
        e.setAttribute('fill', options.fill);
        e.setAttribute('stroke-width', options.stroke_width);
        e.setAttribute('transform-origin', options.transform_origin);
        e.setAttribute('transform', options.transform);

        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.appendChild(e);
            //this.svg.innerHTML += `<ellipse cx="${x}" cy="${y}" stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" rx="${w}" ry="${h}" ${str_clip_path}/>`;
        }
    }
    line(x1, y1, x2, y2,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
            stroke_linecap: 'round'
        }) {

        let e = document.createElement('line');
        e.setAttribute('x1', x1);
        e.setAttribute('y1', y1);
        e.setAttribute('x2', x2);
        e.setAttribute('y2', y2);
        if (typeof options.clip === 'undefined') options.clip = false;
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;

        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"  stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" stroke-linecap="${options.stroke_linecap}" />`;
        }
    }
    text(text, x, y,
        options = {
            font_family: 'Helvetica, Arial, sans-serif',
            text_anchor: 'middle',
            font_style: 'normal',
            font_weight: '600',
            font_size: this.fontsize * 0.5,
            color: this.color,
        }
    ) {
        if (typeof options.font_family === 'undefined') options.font_family = 'Helvetica, Arial, san-serif';
        if (typeof options.text_anchor === 'undefined') options.text_anchor = 'middle';
        if (typeof options.font_style === 'undefined') options.font_style = 'normal';
        if (typeof options.font_weight === 'undefined') options.font_weight = '600';
        if (typeof options.font_size === 'undefined') options.font_size = this.fontsize * 0.5;
        if (typeof options.color === 'undefined') options.color = this.color;
        if (typeof options.clip === 'undefined') options.clip = false;
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;
        let e = document.createElement('text');
        e.setAttribute('text', text);
        e.setAttribute('x', x);
        e.setAttribute('y', y);

        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.innerHTML += `<text x="${x}" y="${y}" fill="${options.color}" font-family="${options.font_family}" font-style="${options.font_style}" font-weight=${options.font_weight} text-anchor="${options.text_anchor}" font-size="${options.font_size}" alignment-baseline="bottom">${text}</text>`;
        }
    }
    polygon(str_points,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
        }) {
        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.clip === 'undefined') options.clip = false;
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;

        let e = document.createElement('polygon');
        e.setAttribute('points', str_points);
        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.innerHTML += `<polygon points="${str_points}" fill="${options.fill}" stroke="${options.stroke}" stroke-width="${options.stroke_width}" rx="${this.stroke_width}" ry="${this.line_width}"></polygon>`
        }
    }
    path(str_path,
        options = {
            stroke_width: this.line_width,
            stroke: this.color,
            fill: "transparent",
            transform_origin: 'center',
            transform: ''
        }) {

        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.clip === 'undefined') options.clip = false;
        if (typeof options.transform_origin === 'undefined') options.transform_origin = 'center';
        if (typeof options.transform === 'undefined') options.transform = '';
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;


        //str_path = str_path.replace(/ /g, '');
        str_path = str_path.replace(/\n/g, '');

        let e = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        e.setAttribute('d', str_path);
        e.setAttribute('transform-origin', options.transform_origin);
        e.setAttribute('transform', options.transform);
        e.setAttribute('fill', options.fill);
        e.setAttribute('stroke', options.stroke);
        e.setAttribute('stroke-width', options.stroke_width);

        if (this.is_clipping) {
            document.querySelector(`#${this.clip_id}`).appendChild(e);
        }
        else {
            this.svg.appendChild(e);
            //this.svg.innerHTML += `<path d="${str_path}" fill="${options.fill}" stroke="${options.stroke}" stroke-width="${options.stroke_width}" rx="${this.stroke_width}" ry="${this.line_width}"></polygon>`
        }
    }
    /**
     * 
     * @param {*} cx 
     * @param {*} cy 
     * @param {*} r 
     * @param {*} start 
     * @param {*} stop set smaller size than start angle
     * @param {*} options 
     * @returns 
     */
    arc(cx, cy, r, start, stop,
        options = {
            stroke_width: this.line_width,
            stroke: this.color,
            fill: "transparent",
            clip: false,
            large: 0,
            draw: true
        }
    ) {
        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.clip === 'undefined') options.clip = false;
        if (typeof options.draw === 'undefined') options.draw = true;
        if (typeof options.large === 'undefined') options.large = 0;
        let str_clip_path = '';
        if (options.clip) str_clip_path = `clip-path="url(#${this.clip_id})"`;

        let x1 = cx + r * Math.cos(this.d2r(start));
        let y1 = cy + r * Math.sin(this.d2r(start));
        let x2 = parseInt(cx + r * Math.cos(this.d2r(stop)));
        let y2 = cy + r * Math.sin(this.d2r(stop));
        let dx = x2 - x1;
        let dy = y2 - y1;
        let str_path = `M ${x1} ${y1} A ${r} ${r} 0 ${options.large} ${options.large} ${x2} ${y2}`;


        if (options.draw) {
            let e = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            e.setAttribute('d', str_path);
            e.setAttribute('fill', options.fill);
            e.setAttribute('stroke', options.stroke);
            e.setAttribute('stroke-width', options.stroke_width);

            if (this.is_clipping) {
                document.querySelector(`#${this.clip_id}`).appendChild(e);
            }
            else {
                this.svg.appendChild(e);
                //this.svg.innerHTML += `<path d="${str_path}" fill="${options.fill}" stroke="${options.stroke}" stroke-width="${options.stroke_width}"></path>`

            }
        }

        return {
            getD: function () {
                return str_path;
            }
        }



    }

    async beginClip() {
        this.clip_id = `${this.name}_${this.getRandomID()}`;
        this.svg.innerHTML += `<defs><clipPath id="${this.clip_id}"></clipPath></defs>`;
        this.is_clipping = true;
        return Promise.resolve(1);
    }
    async endClip() {
        this.is_clipping = false;
        return Promise.resolve(1);
    }

    getRandomID() {
        return Math.random().toString(32).substring(2);
    }
}

function addSVGElement(svg_width, svg_height, element_appended) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute('version', '1.1');
    element.setAttribute('baseProfile', 'full');
    element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    element.setAttribute('width', `${svg_width}`);
    element.setAttribute('height', `${svg_height}`);
    element.setAttribute('viewbox', `0 0 ${svg_width} ${svg_height}`)
    element.style.verticalAlign = '-0.15em'; //svgキャンバスとテキストのズレ調整
    element_appended.appendChild(element);
    return element;
}


function loadPiconTags(dom_picon) {

    let elements = [];
    if (dom_picon) {
        elements = [dom_picon];
    }
    else {
        elements = document.querySelectorAll('i[data-pc-id]');
    }

    //for (let e of elements = elements.querySelectorAll('[data-pc]');
    // piconタグを見つけた場合は該当箇所にsvgアイコンを挿入
    if (elements.length > 0) {
        let id_count = 0;
        for (let e of elements) {
            const name = e.getAttribute('data-pc-id')
            const fontsize = window.getComputedStyle(e).getPropertyValue('font-size');
            if (dom_picon) e.id = dom_picon.id;
            else e.id = `picon_${id_count}`;
            if (name == 'clock') {

                let hour, minute;
                if ((hour = e.getAttribute('data-pc-hour')) == null) { hour = 10 }
                if ((minute = e.getAttribute('data-pc-minute')) == null) { minute = 10 }
                new picon(`#${e.id}`, name, {
                    clock: {
                        hour: hour,
                        minute: minute,
                    }
                });
            }
            else if (name == 'battery') {
                let percentage;
                let show_value;
                if ((percentage = e.getAttribute('data-pc-percentage')) == null) { percentage = 80 }
                if (e.hasAttribute('data-pc-show-value')) {
                    let v = String(e.getAttribute('data-pc-show-value'));
                    show_value = JSON.parse(v.toLowerCase());
                }
                else {
                    show_value = picon_defaults.battery.show_value
                }

                new picon(`#${e.id}`, name, {
                    battery: {
                        percentage: percentage,
                        show_value: show_value,
                    }
                });
            }
            else if (name == 'calendar') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = '25' }
                new picon(`#${e.id}`, name, {
                    calendar: {
                        text: text,
                    }
                });
            }
            else if (name == 'badge') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = 'BA' }
                new picon(`#${e.id}`, name, {
                    badge: {
                        text: text,
                    }
                });
            }
            else if (name == 'circle') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = picon_defaults.circle.text }
                new picon(`#${e.id}`, name, {
                    circle: {
                        text: text,
                    }
                });
            }
            else if (name == 'arrow') {
                let angle;
                let type;
                let surround
                if ((angle = e.getAttribute('data-pc-angle')) == null) { angle = picon_defaults.arrow.angle }
                if ((type = e.getAttribute('data-pc-type')) == null) { type = picon_defaults.arrow.type }
                if ((surround = e.getAttribute('data-pc-surround')) == null) { surround = picon_defaults.arrow.surround }
                // if (e.hasAttribute('data-pc-surround')) surround = e.getAttribute('data-pc-surround');
                // else surround = picon_defaults.arrow.surround;
                new picon(`#${e.id}`, name, {
                    arrow: {
                        angle: angle,
                        type: type,
                        surround: surround
                    }
                });
            }
            else if (name == 'filetype') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = picon_defaults.filetype.text }
                new picon(`#${e.id}`, name, {
                    filetype: {
                        text: text,
                    }
                });
            }
            else if (name == 'volume') {
                let value;
                if ((value = e.getAttribute('data-pc-value')) == null) { text = picon_defaults.volume.value }
                new picon(`#${e.id}`, name, {
                    volume: {
                        value: value,
                    }
                });
            }
            else if (name == 'chat') {
                let angle;
                let text;
                if ((angle = e.getAttribute('data-pc-angle')) == null) { angle = picon_defaults.chat.angle }
                if ((text = e.getAttribute('data-pc-text')) == null) { text = picon_defaults.chat.text }
                new picon(`#${e.id}`, name, {
                    chat: {
                        angle: angle,
                        text: text
                    }
                });
            }
            else if (name == 'person') {
                let size;
                let text;
                if ((size = e.getAttribute('data-pc-size')) == null) { size = picon_defaults.person.size }
                if ((text = e.getAttribute('data-pc-text')) == null) { text = picon_defaults.person.text }
                new picon(`#${e.id}`, name, {
                    person: {
                        size: size,
                        text: text
                    }
                });
            }
            else if (name == 'compass') {
                let angle;
                if ((angle = e.getAttribute('data-pc-angle')) == null) { angle = picon_defaults.compass.angle }

                new picon(`#${e.id}`, name, {
                    compass: {
                        angle: angle
                    }
                });
            }

            id_count++;
        }




    }
}
loadPiconTags();