import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  it('renders title and static instructional text', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument()
    expect(
      screen.getByText(/click on the vite and react logos to learn more/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/edit\s+src\/App\.jsx\s+and save to test HMR/i)
    ).toBeInTheDocument()
  })

  it('shows initial count and updates when Plus/Minus are clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const plusBtn = screen.getByRole('button', { name: /plus/i })
    const minusBtn = screen.getByRole('button', { name: /minus/i })

    // Initial state
    expect(screen.getByText(/current count:\s*0/i)).toBeInTheDocument()

    // Increment twice
    await user.click(plusBtn)
    expect(screen.getByText(/current count:\s*1/i)).toBeInTheDocument()
    await user.click(plusBtn)
    expect(screen.getByText(/current count:\s*2/i)).toBeInTheDocument()

    // Decrement once
    await user.click(minusBtn)
    expect(screen.getByText(/current count:\s*1/i)).toBeInTheDocument()

    // Decrement twice more to validate negative values
    await user.click(minusBtn)
    expect(screen.getByText(/current count:\s*0/i)).toBeInTheDocument()
    await user.click(minusBtn)
    expect(screen.getByText(/current count:\s*-1/i)).toBeInTheDocument()
  })
})