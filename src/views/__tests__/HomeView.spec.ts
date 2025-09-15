import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.open
const openMock = vi.fn()
Object.defineProperty(window, 'open', {
  value: openMock
})

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('parses input correctly', async () => {
    const wrapper = mount(HomeView)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('123\tNombre\tABC\t456\n789\tOtro\tDEF\t012')
    expect(wrapper.vm.items).toHaveLength(2)
    expect(wrapper.vm.items[0]).toEqual({
      nit: '123',
      nombre: 'Nombre',
      codigo: 'ABC',
      numero: '456'
    })
  })

  it('ignores incomplete rows', async () => {
    const wrapper = mount(HomeView)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('123\tNombre\tABC\t456\n789\tOtro')
    expect(wrapper.vm.items).toHaveLength(1)
  })

  it('marks row as visited on goToInvoice', async () => {
    const wrapper = mount(HomeView)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('123\tNombre\tABC\t456')
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(openMock).toHaveBeenCalledWith('https://siat.impuestos.gob.bo/consulta/QR?nit=123&cuf=ABC&numero=456&t=2', '_blank')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('loads visited rows from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ '123-456': true }))
    const wrapper = mount(HomeView)
    expect(wrapper.vm.isVisited({ nit: '123', nombre: 'Nombre', codigo: 'ABC', numero: '456' })).toBe(true)
  })

  it('resets state on focus', async () => {
    const wrapper = mount(HomeView)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('123\tNombre\tABC\t456')
    await textarea.trigger('focus')
    expect(wrapper.vm.inputValues).toBe('')
  })
})