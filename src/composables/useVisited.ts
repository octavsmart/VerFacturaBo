import { ref, onMounted, watch } from 'vue'

type VisitedRow = Record<string, boolean>

export function useVisited() {
  const visitedRows = ref<VisitedRow>({})

  onMounted(() => {
    const stored = localStorage.getItem('visitedRows')
    if (stored) {
      try {
        visitedRows.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing visitedRows from localStorage:', e)
      }
    }
  })

  watch(visitedRows, (newVal) => {
    localStorage.setItem('visitedRows', JSON.stringify(newVal))
  }, { deep: true })

  const markVisited = (key: string) => {
    visitedRows.value = { ...visitedRows.value, [key]: true }
  }

  const isVisited = (key: string): boolean => {
    return visitedRows.value[key] || false
  }

  const resetVisited = () => {
    visitedRows.value = {}
  }

  return {
    visitedRows,
    markVisited,
    isVisited,
    resetVisited
  }
}