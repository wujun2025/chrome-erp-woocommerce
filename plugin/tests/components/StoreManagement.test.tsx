import { render, screen } from '@testing-library/react'
import { TranslationProvider } from '../src/hooks/useTranslation'
import { StoreManagement } from '../src/components/StoreManagement'

// Mock Zustand store
jest.mock('../src/store', () => ({
  useStoreConfig: () => ({
    stores: [],
    activeStore: null,
    storeStatuses: {},
    addStore: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
    setActiveStore: jest.fn(),
    updateStoreStatus: jest.fn()
  })
}))

// Mock API service
jest.mock('../src/services/api', () => ({
  apiService: {
    setStoreConfig: jest.fn(),
    testConnection: jest.fn().mockResolvedValue({ success: true })
  }
}))

describe('StoreManagement', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <TranslationProvider>
        {component}
      </TranslationProvider>
    )
  }

  test('renders store management title', () => {
    renderWithProviders(<StoreManagement />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('shows add store button', () => {
    renderWithProviders(<StoreManagement />)
    expect(screen.getByRole('button', { name: /添加店铺/i })).toBeInTheDocument()
  })

  test('shows no stores message when no stores exist', () => {
    renderWithProviders(<StoreManagement />)
    expect(screen.getByText(/暂无店铺/i)).toBeInTheDocument()
  })
})