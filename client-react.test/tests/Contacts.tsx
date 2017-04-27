import { expect } from "chai";
import { mount } from 'enzyme'
import * as React from "react";
import * as ReactDOM from "react-dom"
import * as ReactTestUtilsfrom from "react-addons-test-utils";
import { MemoryRouter as Router, Route } from 'react-router-dom';
import * as sinon from 'sinon';
import Routes from '../../client-react/components/Routes';
import { Contacts } from '../../client-react/components/Contacts';

describe("<Contacts/> component ", function () {
    it("renders a h1", function (done) {
        var res = {
            status: 200,
            headers: {
                get: function (key: string) { return 'application/json'; }
            },
            json: function () { return Promise.resolve([{ contactId: 1, lastName: 'holt', firstName: 'brady' }]) }
        };
        (global as any).fetch = function () { }
        sinon.stub(global, 'fetch').resolves(res);

        const mountWithRouter = (args: any) => mount(<Contacts {...args} />);
        const wrapper = mount(<Router>
            <Route component={Contacts} />
        </Router>);

        setImmediate(function(){
            expect(wrapper.find('tr').last().html()).to.contain("holt");
            done();
        });
        // return new Promise((resolve, reject) => {
        //     setTimeout(function () {
        //         expect(wrapper.find('tr')).to.have.length(1);
        //         resolve();
        //     }, 1000)
        // });

    });
});
