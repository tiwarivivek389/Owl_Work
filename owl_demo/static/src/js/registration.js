odoo.define('owl_demo.registration', function (require) {
    "use strict";

    require('web.dom_ready');
    if (!$('.registration').length) {
        return Promise.reject("DOM doesn't contain '.registration'");
    }

    const rpc = require('web.rpc');

    const { Component, hooks } = owl;
    const { xml } = owl.tags;
    const { whenReady } = owl.utils;

    class owlRagistartioncom extends Component {
        // email = "";
        async willStart(){
            console.log('hhhhhhhhhhhhhhhh')
            this.Regist = await rpc.query({
                route: '/my/user_register'
            });
        }
        
        async _onClickLink(ev) {
            debugger
            const form = document.querySelector('#registration_form');
            let formData = new FormData(form);
            formData = Object.fromEntries(formData);
            
            this.registartion = await rpc.query({
                route: "/my/user_register", 
                params: {'form_data': formData}
            });
            window.location.href = "/web/login"
        }

        static template = xml`
        <div>
        
            <form class="form" id="registration_form">
                <section>
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-8 col-xl-6">
                        <div class="row">
                            <div class="col text-center">
                              <h1>Register</h1>
                            </div>
                        </div>
                         <div class="form-group">
                        <label class='label'>
                            <p class="label-txt">Enter Your Organizer Email</p>
                            <input type="email" name="email" class="form-control"/>
                            </label>
                            </div>
                             <div class="form-group">
                        <label class='label'>
                            <p class="label-txt">Enter Your Organizer Name</p>
                            <input type="text" name="name" class="form-control"/>  
                        </label>
                        </div>
                        <div class="form-group">
                        <label class='label'>
                            <p class="label-txt">ENTER YOUR PASSWORD</p>
                            <input type="text" name="password" class="form-control"/>
                        </label>
                        </div>
                          <div class="form-group">  
                        <label class='label'>SELECT YOUR CURRENCY</label>
                        <div id="currncy_id">
                            <select name="currency_id" class="form-control currency_id">
                                <t t-foreach="Regist.resulrt" t-as="currency"  t-key="'row_' + row_index">
                                    <option t-att-value="currency.id">
                                        <t t-esc="currency.name" />
                                    </option>
                                </t>
                            </select>
                        </div>
                        </div>
                        <p></p>
                        <button t-on-click="_onClickLink" class="button btn btn-primary"  type="button">submit</button>
                    </div>
                </div>
                </div>
                </section>
            </form>
        </div>
        `;
    }

    function setup() {
        const registartioninstance = new owlRagistartioncom();
        registartioninstance.mount($('.registration')[0]);
    }

    whenReady(setup);

    return owlRagistartioncom;
});