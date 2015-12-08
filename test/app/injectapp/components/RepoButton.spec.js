import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import RepoButton from '../../../../app/injectpage/components/RepoButton';

function setup(propOverrides) {
  const props = {
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<RepoButton {...props} />);
  const output = renderer.getRenderOutput();

  return { props, output };
}

describe('inject RepoButton component', () => {

  it('should render correctly', () => {
    const { output } = setup();
    expect(output.type).to.equal('a');
    expect(output.props.href).to.equal('https://github.com/jhen0409/react-chrome-extension-boilerplate');
    expect(output.props.children).to.equal('view repo');
  });
});