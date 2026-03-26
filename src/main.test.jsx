import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';

let renderMock;
let createRootMock;

// Mock react-dom/client to intercept createRoot and render calls
vi.mock('react-dom/client', () => {
  return {
    default: {
      createRoot: (...args) => createRootMock(...args),
    },
    createRoot: (...args) => createRootMock(...args),
  };
});

describe('src/main.jsx bootstrapping', () => {
  beforeEach(() => {
    // Fresh mocks and DOM for each test
    renderMock = vi.fn();
    createRootMock = vi.fn(() => ({ render: renderMock }));
    document.body.innerHTML = '<div id="root"></div>';
  });

  test('mounts App into #root via ReactDOM.createRoot and renders with StrictMode', async () => {
    // Import after mocks and DOM setup so side-effects run against mocks
    await import('./main.jsx');

    const rootElem = document.getElementById('root');

    // Verifies root mounting
    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock).toHaveBeenCalledWith(rootElem);

    // Verifies render was called with a StrictMode-wrapped element
    expect(renderMock).toHaveBeenCalledTimes(1);
    const renderedTree = renderMock.mock.calls[0][0];

    expect(React.isValidElement(renderedTree)).toBe(true);
    expect(renderedTree.type).toBe(React.StrictMode);

    // Ensure StrictMode has at least one child (the App component)
    const child = Array.isArray(renderedTree.props?.children)
      ? renderedTree.props.children[0]
      : renderedTree.props?.children;

    expect(child).toBeTruthy();
    expect(React.isValidElement(child)).toBe(true);
  });
});