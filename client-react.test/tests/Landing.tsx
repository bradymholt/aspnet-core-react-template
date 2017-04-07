import { expect } from "chai";
import { mount } from 'enzyme'
import * as React from "react";
import * as ReactDOM from "react-dom"
import * as ReactTestUtilsfrom from "react-addons-test-utils";

import { Landing } from '../../client-react/components/Landing';

describe("<Landing/> component ", function () {    it("renders a h1", function () {
        const wrapper = mount(<Landing compiler="foo" framework="bar" />);
        expect(wrapper.find('h1')).to.have.length(1);
    });
});
