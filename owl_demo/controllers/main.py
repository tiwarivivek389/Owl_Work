# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request


class OwlController(http.Controller):

    @http.route('/my_orders', type='http', auth="public", csrf=False)
    def owl_demo(self, **post):
        return http.request.render("owl_demo.orders_template")

    @http.route('/get_order_details', type='json', auth="public", csrf=False)
    def get_partner(self, **post):
        domain = [
            ('partner_id', '=', request.env.user.partner_id.id),
            ('state', 'in', ['sale', 'done'])
        ]
        return request.env['sale.order'].sudo().search_read(domain, ['id', 'name', 'date_order', 'amount_total'])

    @http.route('/get_data/', type='http', auth="public", csrf=False)
    def owl_details(self, **post):
        return http.request.render("owl_demo.detail_template")

    @http.route('/order_detail', type='json', auth="public", csrf=False)
    def order_data(self, **kw):
        order = request.env['sale.order'].sudo().search([('id', '=', kw.get('order_id'))])
        order_detail = order.order_line.read(['id', 'name', 'price_unit', 'price_tax', 'price_total', 'product_uom_qty', 'product_id'])
        products = {}
        for line in order.order_line:
            products[line.id] = line.product_id.image_1920
        sale_detail = order.read(['name', 'date_order'])
        partner_detail = order.partner_id.read(['id', 'name', 'street', 'city', 'zip'])
        return {'details': order_detail, 'order': sale_detail, 'partner': partner_detail, 'products': products}

    @http.route('/owl_demo', type='http', auth="public", csrf=False)
    def owl_demo_reg(self, **post):
        return http.request.render("owl_demo.demo_template")

    @http.route(['/my/user_register'], type='json', auth="public", website=True, methods=['GET', 'POST'])
    def user_registration(self, form_data=False, **kw):
        if form_data:
            partner = request.env['res.partner'].sudo().create({
                'name': form_data.get("name"),
                "email": form_data.get("email"),
            })
            currency = request.env['res.currency'].browse(
                [int(form_data.get("currency_id"))])
            company = request.env['res.company'].sudo().create({
                "name": form_data.get("name"),
                "partner_id": partner.id,
                "currency_id": currency.id,
            })
            request.env["res.users"].sudo().create({
                'login': form_data.get("name"),
                'password': form_data.get('password'),
                'name': form_data.get('name'),
                'email': form_data.get('email'),
                'company_id': company.id,
                'company_ids': [(4, company.id)],
                'groups_id': [(6, 0, [request.env.ref('base.group_portal').id])],
            })
        return {'resulrt': request.env['res.currency'].sudo().search_read([], ['id',  'name'])}

    @http.route('/add_event', type='http', auth="public", csrf=False, website=True)
    def add_event(self, **post):
        return http.request.render("owl_demo.add_tournament")

    # add course rpc page
    @http.route('/add_tournament', type='json', auth="public", csrf=False, website=True)
    def demo_AddCources(self, form_data=False, **post):

        print(form_data, "\n\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>")
        if form_data:
            prodct = request.env['product.template'].sudo().create({
                'name': form_data.get("name"),
                "list_price": form_data.get("price"),
            })
        return True
