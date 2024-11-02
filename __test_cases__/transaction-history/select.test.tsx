import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/shadcn_ui/select'

describe('Select Component', () => {
  it('renders SelectTrigger and displays placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('opens SelectContent on SelectTrigger click', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    fireEvent.click(screen.getByText('Select an option'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('selects an item and displays it in SelectTrigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    fireEvent.click(screen.getByText('Select an option'))
    fireEvent.click(screen.getByText('Option 1'))

    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })
})
