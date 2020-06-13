odoo.define('owl_demo.event_list', function (require) {
    "use strict";

    require('web.dom_ready');
    if (!$('.event_list').length) {
        return Promise.reject("DOM doesn't contain '.event_list'");
    }

    const { Component, hooks } = owl;
    const { xml } = owl.tags;
    const { whenReady } = owl.utils;

    class OwlDemo extends Component {
         static template = xml`<div>todo app hello</div>`;
    }

    function setup() {
        const OwlDemoInstance = new OwlDemo();
        OwlDemoInstance.mount($('.event_list')[0]);
    }

    whenReady(setup);

    return OwlDemo;
});
