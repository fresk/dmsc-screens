var Hammer = require('hammerjs');


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if(inIframe()){
    // get touch events from tuio over ws
    window.client = new Caress.Client({
        host: '192.168.1.111',
        port: 5000
    });
    client.connect();
}



exports.install = function (Vue) {


    Vue.directive('touch', {
        isFn: true,

        bind: function () {
            if (!this.el.hammer) {
                this.el.hammer = Hammer(this.el)
            }
        },

        update: function (fn) {
            var vm = this.vm
            this.handler = function (e) {
                e.targetVM = vm
                fn.call(vm, e)
            }
            this.el.hammer.on(this.arg, this.handler)
        },

        unbind: function () {
            this.el.hammer.off(this.arg, this.handler)
            if (! this.el.hammer._eventHandler || !this.el.hammer._eventHandler.length) {
                this.el.hammer = null
            }
        }
    });



    Vue.directive('scroll', {
        bind: function () {
            var el = this.el;
            var options = {'tap': 'itemTap', click:true};
            if(!el._iscroll){
                el._iscroll = new IScroll(this.el, options);
            }
            setTimeout(function(){
                el._iscroll.refresh();
            }, 500);
        },
        update: function (value) {
            // do something based on the updated value
            // this will also be called for the initial value
            console.log("update iScroll");
        },
        unbind: function () {
            if(this.el._iscroll){
                this.el._iscroll.destroy();
                this.el._iscroll = null;
            }
        }
    });


}
