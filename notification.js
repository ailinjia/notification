var notification = (function() {
    var pos_factor = {
        'top-left':     [  0,  0 ],
        'left-top':     [  0,  0 ],
        'top':          [ .5,  0 ],
        'top-right':    [  1,  0 ],
        'right-top':    [  1,  0 ],
        'left':         [  0, .5 ],
        'center':       [ .5, .5 ],
        'right':        [  1, .5 ],
        'bottom-left':  [  0,  1 ],
        'left-bottom':  [  0,  1 ],
        'bottom':       [ .5,  1 ],
        'bottom-right': [  1,  1 ],
        'right-bottom': [  1,  1 ]
    };
    /*
     * option = {
     *     timeout:
     *     width:
     *     height:
     *     content:
     *     position:
     *     onclose:
     *     container:
     * };
     */
    function notification(type, option) {
        var el = document.createElement('div');
        var icon;

        el.classList.add('notification');

        switch (type) {
        case 'success':
            icon = 'fa-check';
            el.classList.add('notification_success');
            break;
        case 'warning':
            icon = 'fa-warning';
            el.classList.add('notification_warning');
            break;
        case 'error':
            icon = 'fa-bug';
            el.classList.add('notification_error');
            break;
        default:
            icon = 'fa-bell';
        }
        if (typeof(option) != 'object') {
            option = {
                content: option,
            };
        }
        var btn_html = '';
        if (option.button) {
            let btns = [];
            btns.push('<div class="nf_button_container">');
            for (let i = 0; i < option.button.length; i++) {
                let b = option.button[i];
                let color = b.theme ? b.theme : 'ok';
                btns.push(`<div class="nf_button nf_button_${color}">${b.text}</div>`);
            }
            btns.push('</div>');
            btn_html = btns.join('');

            /* XXX: override some */
            el.classList.add('nf_confirm');
        }
        var html = `
                <div class="notification_icon">
                    <span><i class="fa fa-fw ${icon}"></i></span>
                </div>
                <div class="notification_content">
                    <span>${option.content}</span>
                    ${btn_html}
                </div>
                <div class="notification_close">
                    <span><i class="fa fa-fw fa-times-circle"></i></span>
                </div>
            `;
        el.innerHTML = html;
        if (option.width) {
            el.style.width = option.width;
        } else {
            el.style.width = '400px';
        }
        if (!option.position) {
            option.position = 'center';
        }
        //el.style.height = option.height;
        var parent = option.container ? option.container : document.body;
        var width = parent.offsetWidth;
        var height = parent.offsetHeight;
        var factor = pos_factor[option.position];
        var left = width * factor[0];
        var top = height * factor[1];

        el.style.top = '-999px';
        parent.appendChild(el);

        const GAP = 20;
        switch (factor[0]) {
        case 0: left += GAP; break;
        case 1: left -= GAP; break;
        }
        switch (factor[1]) {
        case 0: top += GAP; break;
        case 1: top -= GAP; break;
        }
        el.style.left = '' + (left - el.offsetWidth * factor[0]) + 'px';
        el.style.top = '' + (top - el.offsetHeight * factor[1]) + 'px';

        /* XXX: remove */
        el.addEventListener('transitionend', function(ev) {
            if (ev.propertyName == 'opacity') {
                parent.removeChild(el);
            }
        }, false);

        var close = el.querySelector('.notification_close span i');
        close.addEventListener('click', function(ev) {
            el.style.opacity = 0;
            if (option.onclose) {
                option.onclose();
            }
        }, false);

        if (option.button) {
            let btns = el.querySelectorAll('.notification_content .nf_button');
            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener('click', function(ev) {
                    el.style.opacity = 0;
                    if (option.button[i].onclick)
                        option.button[i].onclick(ev);
                }, false);
            }
        }

        if (option.timeout && option.timeout > 0) {
            setTimeout(function() {
                el.style.opacity = 0;
                if (option.onclose) {
                    option.onclose();
                }
            }, option.timeout);
        }
    }

    var success = function(option) {
        return notification('success', option);
    }

    var warning = function(option) {
        return notification('warning', option);
    }

    var error = function(option) {
        return notification('error', option);
    }

    return {
        success: success,
        warning: warning,
        error: error
    };
})();
