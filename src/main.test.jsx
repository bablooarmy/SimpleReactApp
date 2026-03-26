import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'

// Prepare hoisted variables for mocks so they can be assigned before importing the module under test
let renderMock
let createRootMock
let MockApp

vi.mock('react-dom/client', () => ({
  createRoot: (...args) => createRootMock(...args),
}))

vi.mock('./App.jsx', () => ({
  default: MockApp,
}))

describe('src/main.jsx', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    // Set up DOM root element
    document.body.innerHTML = '<div id="root"></div>'

    // Initialize mocks before importing the module under test
    renderMock = vi.fn()
    createRootMock = vi.fn(() => ({ render: renderMock }))
    MockApp = () => React.createElement('div', null, 'Mocked App')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('creates a React root on #root and renders App wrapped in React.StrictMode', async () => {
    // Import after mocks and DOM setup so side effects run with our mocks
    await import('./main.jsx')

    const container = document.getElementById('root')
    expect(container).not.toBeNull()

    // Assert ReactDOM.createRoot called with the #root container
    expect(createRootMock).toHaveBeenCalledTimes(1)
    expect(createRootMock).toHaveBeenCalledWith(container)

    // Assert render is called with a React element wrapped in StrictMode
    expect(renderMock).toHaveBeenCalledTimes(1)
    const [renderArg] = renderMock.mock.calls[0]

    expect(React.isValidElement(renderArg)).toBe(true)
    // The top-level element should be React.StrictMode
    expect(renderArg.type).toBe(React.StrictMode)

    // And it should contain our App component as its child
    const strictChildren = renderArg.props.children
    const childElement = Array.isArray(strictChildren) ? strictChildren[0] : strictChildren
    expect(React.isValidElement(childElement)).toBe(true)
    // Ensure the child is the mocked App component
    expect(childElement.type).toBe(MockApp)
  })
})