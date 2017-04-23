import { expect } from "chai";
import { mount } from 'enzyme'
import * as React from "react";
import * as ReactDOM from "react-dom"
import * as ReactTestUtilsfrom from "react-addons-test-utils";

import { Contacts } from '../../client-react/components/Contacts';

describe("<Contacts/> component ", function () {    it("renders a h1", function () {
        const wrapper = mount(<Contacts />);
        expect(wrapper.find('h1')).to.have.length(1);
    });
});
