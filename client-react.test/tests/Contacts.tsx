import { expect } from "chai";
import { mount, shallow } from 'enzyme'
import * as React from "react";
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { stubFetch } from '../utils';

import { Contacts } from '../../client-react/components/Contacts';

describe("<Contacts/> component ", function () {
    it("renders a h1", function () {
        let emptyArgs: any = {};
        const wrapper = shallow(<Contacts {...emptyArgs} />);
        expect(wrapper.find('h1')).to.have.length(1);
    });

    it("renders a list of contacts", function (done) {
        let fakeContactsData = [{ contactId: 1, lastName: 'Smith', firstName: 'John' }];
        let fetchStub = stubFetch(fakeContactsData);

        const wrapper = mount(<Router>
            <Route component={Contacts} />
        </Router>);

        setImmediate(function () {
            expect(wrapper.find('tr').last().html()).to.contain(fakeContactsData[fakeContactsData.length - 1].lastName);
            fetchStub.restore();
            done();
        });
    });
});
