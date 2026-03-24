import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  test('renders heading, initial count, and instructional texts', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Edit\s+src\/App\.jsx\s+and save to test HMR/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Click on the Vite and React logos to learn more/i)
    ).toBeInTheDocument()
  })

  test('increments the count when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })

    await user.click(button)
    expect(button).toHaveTextContent(/count is 1/i)

    await user.click(button)
    expect(button).toHaveTextContent(/count is 2/i)
  })
})