odoo.define('owl_demo.addevent', function (require) {
    "use strict";

    require('web.dom_ready');
    if (!$('.addevent').length) {
        return Promise.reject("DOM doesn't contain '.addevent'");
    }

    const rpc = require('web.rpc');

    const { Component, hooks } = owl;
    const { xml } = owl.tags;
    const { whenReady } = owl.utils;

    class add_Event extends Component {
        
        async _onClickLink(ev) {
            debugger
            const form = document.querySelector('#eventform');
            let formData = new FormData(form);
            formData = Object.fromEntries(formData);
            
            this.event = await rpc.query({
                route: "/add_tournament", 
                params: {'form_data': formData}
            });
            // window.location.href = "/web/login"
        }

        static template = xml`
        <div>
            <form class="form" id="eventform">
                <section>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-8 col-lg-8 col-xl-6">
                                <div class="row">
                                    <div class="col text-center">
                                    <h1>Add Event</h1>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class='label'>
                                    <p class="label-txt">Enter Tournament Name</p>
                                        <input type="text" name="name" class="form-control"/>
                                    </label>
                                </div>
                                <div class="form-group">
                                    <label class='label'>
                                        <p class="label-txt">Enter tournament Price</p>
                                        <input type="text" name="price" class="form-control"/>  
                                    </label>
                                </div>
                            </div>
                            <p></p>
                            <button t-on-click="_onClickLink" class="button btn btn-primary"  type="button">submit</button>
                        </div>
                    </div>
                </section>
            </form>
        </div>
        `;
    }

    function setup() {
        const registartioninstance = new add_Event();
        registartioninstance.mount($('.addevent')[0]);
    }

    whenReady(setup);

    return add_Event;
});