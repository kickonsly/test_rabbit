import 'cypress-xpath'
import 'cypress-wait-until'
const thai_id_card = require('thai-id-card') // for ES5
/// <reference types="cypress" />

context('Finance - Rabbit Internet', () => {
    before(function () {
        cy.fixture('testdata').then(function(testdata){
            this.testdata = testdata
        })
    })
    it('Interest Insurance IPD/OPD Covered Salary Man', function() {
        cy.visit(`https://${this.testdata.username}:${this.testdata.password}@staging-finance.rabbitinternet.com/en/product/health-insurance/questions`)
        cy.viewport(2000, 1600)
        cy.xpath(`//div[@id="product_category"]//label[.="${this.testdata.product_category}"]`).click()
        cy.xpath(`//div[@id="product_ipdopd_subcategory"]//label[.="${this.testdata.product_ipdopd_subcategory}"]`).click()
        cy.xpath('//*[@id="customer_phone"]//input').type(this.testdata.customer_phone)
        cy.xpath('//*[@id="customer_phone"]//button').click()
        cy.xpath('//input[@name="customer_first_name"]').type(this.testdata.customer_first_name)
        cy.xpath('//input[@name="customer_last_name"]').type(this.testdata.customer_last_name)
        cy.xpath('//*[@id="customer_first_name"]//button').click()
        cy.xpath('//input[@name="customer_email"]').type(this.testdata.customer_email)
        cy.xpath('//*[@id="customer_email"]//button').click()
        cy.xpath(`//div[@id="customer_gender"]//label[.="${this.testdata.customer_gender}"]`).click()
        cy.xpath('//input[@name="customer_dob"]').type(this.testdata.customer_dob)
        cy.xpath('//*[@id="customer_dob"]//button').click()
        if(this.testdata.consent) 
            cy.xpath('//div[@id="tc"]//label[.="Consent"]').click()
        else 
            cy.xpath('//div[@id="tc"]//label[.="No consent"]').click()
        cy.get('#btn-marketing-consent').click()

        cy.waitUntil(() =>
            cy.get('#health-category').select(this.testdata.product_category), {
            errorMsg: 'The loading time was too long even for this crazy thing!',
            timeout: 10000,
            interval: 1000
        });
        cy.xpath('//*[@id="health-category"]/../../div[2]/select').select(this.testdata.product_ipdopd_subcategory)
        cy.xpath('//*[@id="health-category"]/../../div[2]/select').select(this.testdata.product_ipdopd_subcategory)
        cy.xpath('//button[.="APPLY"]').click()

        cy.wait(3000)
        cy.waitUntil(() =>
            cy.xpath('(//button[strong[2]])[1]').invoke('text').then(text => {
                this.insurance_price = text.replace("BUY NOW", "").replace(" THB/Year", "")
                cy.log(this.insurance_price)
            }), {
            errorMsg: 'The loading time was too long even for this crazy thing!',
            timeout: 10000,
            interval: 1000
        });
        cy.xpath('(//div[@class="row"]/div[2]//h2)[1]').invoke('text').then(text => {
            this.insurance_name = text
            cy.log(this.insurance_name)
        })
        cy.xpath('(//div[@class="row"]/div[2]//span[@class="mr-2"])[1]').invoke('text').then(text => {
            this.insurance_product = text
            cy.log(this.insurance_product)
        })
        cy.xpath('(//button[strong[.="BUY NOW"]])[1]').click()

        cy.waitUntil(() =>
            cy.xpath('//input[@name="customer_first_name"]').clear().type(this.testdata.customer_first_name), {
            errorMsg: 'The loading time was too long even for this crazy thing!',
            timeout: 10000,
            interval: 1000
        });
        cy.xpath('//input[@name="customer_last_name"]').clear().type(this.testdata.customer_last_name)
        cy.xpath('//*[@id="customer_first_name"]//button').click()

        cy.xpath('//*[@id="customer_phone"]//input').invoke('val').then(val => {
            expect(val).to.be.equal(this.testdata.customer_phone)
        })
        cy.xpath('//*[@id="customer_phone"]//button').click()

        cy.xpath('//input[@name="customer_email"]').invoke('val').then(val => {
            expect(val).to.be.equal(this.testdata.customer_email)
        })
        cy.xpath('//*[@id="customer_email"]//button').click()

        cy.xpath(`//div[@id="customer_nationality"]//label[.="${this.testdata.customer_nationality}"]`).click()
        cy.xpath('//*[@id="customer_nationality"]//input[@name="customer_id_card"]').clear().type(thai_id_card.generate())
        cy.waitUntil(() => cy.xpath('//div[@id="customer_nationality"]//button').click(), {
            errorMsg: 'The loading time was too long even for this crazy thing!',
            timeout: 10000,
            interval: 1000
        });
        
        cy.waitUntil(() => 
            cy.get('#customer_address > .row > :nth-child(2) > .form-control').type(this.testdata.customer_address,{force:true}), {
            errorMsg: 'The loading time was too long even for this crazy thing!',
            timeout: 10000,
            interval: 1000
        });
        cy.get('select[name="customer_province"]').select(this.testdata.customer_province)
        cy.get('select[name="customer_district"]').select(this.testdata.customer_district)
        cy.get('select[name="customer_subdistrict"]').select(this.testdata.customer_subdistrict)
        cy.get('select[name="customer_postcode"]').select(this.testdata.customer_postcode)
        cy.xpath('//*[@id="customer_address"]//button').click()
        cy.xpath('//*[@id="customer_billing_same"]//label[.="Yes"]').click()
        cy.xpath('//*[@id="customer_shipping_same"]//label[.="Yes"]').click()
        cy.xpath('//*[@id="customer_health"]//button').click()

        cy.get('.col-8').invoke('text').then(text => {
            cy.log(text)
            expect(text).to.be.include(this.insurance_name)
        })
        cy.get('.col-8 > span').invoke('text').then(text => {
            cy.log(text)
            expect(text).to.be.include(this.insurance_product)
        })
        cy.xpath('//*[@id="summary"]//strong').invoke('text').then(text => {
            cy.log(text)
            expect(text).to.be.include(this.insurance_price)
        })
    })
})