import React from 'react';
import Page from './PageClass';

const DemoComponent = () => <div>Demo Component</div>;

const HOCComponent = (Component) => (props) =>
  (
    <div>
      HOCComponent
      <Component {...props} />
    </div>
  );

const WrappedComponent = HOCComponent(DemoComponent);

const demoData = [
  new Page(
    'a',
    (
      <div
        style={{
          border: '2px red solid',
          height: '100%',
          padding: '10px',
        }}
      >
        page 1
      </div>
    )
  ),
  new Page(
    'b',
    (
      <div
        style={{
          border: '2px red solid',
          height: '100%',
          padding: '10px',
        }}
      >
        page 1
      </div>
    )
  ),
  new Page('c', <div>page 3</div>),
  new Page('d', <DemoComponent />),
  new Page('e', <WrappedComponent />),
];
export default demoData;