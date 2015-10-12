import { expect } from 'chai';
import sinon from 'sinon';
import jsdomReact from '../../jsdomReact';
import React from 'react/addons';
import Footer from '../../../../app/todoapp/components/Footer';
import { SHOW_ALL, SHOW_ACTIVE } from '../../../../app/todoapp/constants/TodoFilters';

const { TestUtils } = React.addons;

function setup(propOverrides) {
  const props = {
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: sinon.spy(),
    onShow: sinon.spy(),
    ...propOverrides
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<Footer {...props} />);
  const output = renderer.getRenderOutput();

  return { props, output };
}

function getTextContent(elem) {
  const children = Array.isArray(elem.props.children) ?
    elem.props.children : [elem.props.children];

  return children.reduce(function concatText(out, child) {
    // Children are either elements or text strings
    return out + (child.props ? getTextContent(child) : child);
  }, '');
}

describe('todoapp Footer component', () => {
  jsdomReact();

  it('should render correctly', () => {
    const { output } = setup();
    expect(output.type).to.equal('footer');
    expect(output.props.className).to.equal('footer');
  });

  it('should display active count when 0', () => {
    const { output } = setup({ activeCount: 0 });
    const [count] = output.props.children;
    expect(getTextContent(count)).to.equal('No items left');
  });

  it('should display active count when above 0', () => {
    const { output } = setup({ activeCount: 1 });
    const [count] = output.props.children;
    expect(getTextContent(count)).to.equal('1 item left');
  });

  it('should render filters', () => {
    const { output } = setup();
    const [, filters] = output.props.children;
    expect(filters.type).to.equal('ul');
    expect(filters.props.className).to.equal('filters');
    expect(filters.props.children.length).to.equal(3);
    filters.props.children.forEach((filter, i) => {
      expect(filter.type).to.equal('li');
      const a = filter.props.children;
      expect(a.props.className).to.equal(i === 0 ? 'selected' : '');
      expect(a.props.children).to.equal([ 'All', 'Active', 'Completed'][i]);
    });
  });

  it('should call onShow when a filter is clicked', () => {
    const { output, props } = setup();
    const [, filters] = output.props.children;
    const filterLink = filters.props.children[1].props.children;
    filterLink.props.onClick({});
    expect(props.onShow.calledWith(SHOW_ACTIVE)).to.equal(true);
  });

  it('shouldnt show clear button when no completed todos', () => {
    const { output } = setup({ completedCount: 0 });
    const [,, clear] = output.props.children;
    expect(clear).to.equal(undefined);
  });

  it('should render clear button when completed todos', () => {
    const { output } = setup({ completedCount: 1 });
    const [,, clear] = output.props.children;
    expect(clear.type).to.equal('button');
    expect(clear.props.children).to.equal('Clear completed');
  });

  it('should call onClearCompleted on clear button click', () => {
    const { output, props } = setup({ completedCount: 1 });
    const [,, clear] = output.props.children;
    clear.props.onClick({});
    expect(props.onClearCompleted.called).to.equal(true);
  });
});