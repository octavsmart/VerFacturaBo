<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVisited } from '../composables/useVisited'
type Item = {
  nit: string
  nombre: string
  codigo: string
  numero: string
}
const inputValues = ref('')
const { markVisited, isVisited: isRowVisited, resetVisited } = useVisited()
const items = computed(() => {
  const rows = inputValues.value.split('\n')
  const parsedItems: Item[] = []
  for (const row of rows) {
    const parts = row.split('\t')
    if (parts.length >= 4 && parts[0].trim()) {
      const [nit, nombre, codigo, numero] = parts
      parsedItems.push({ nit: nit.trim(), nombre: nombre.trim(), codigo: codigo.trim(), numero: numero.trim() })
    }
  }
  return parsedItems
})

function goToInvoice(item: Item) {
  const newPageUrl = `https://siat.impuestos.gob.bo/consulta/QR?nit=${item.nit}&cuf=${item.codigo}&numero=${item.numero}&t=2`
  markVisited(`${item.nit}-${item.numero}`)
  try {
    window.open(newPageUrl, '_blank')
  } catch (e) {
    console.error('Error opening window:', e)
    alert('No se pudo abrir la página. Verifica tu navegador.')
  }
}
function isVisited(item: Item): boolean {
  return isRowVisited(`${item.nit}-${item.numero}`)
}
function resetState() {
  inputValues.value = ''
  resetVisited()
}
defineExpose({
  inputValues,
  items,
  isVisited
})
</script>

<template>
  <main class="container">
    <div class="input-section">
      <label for="input-data">Pega los valores tabulados aquí:</label>
      <textarea
        id="input-data"
        v-model="inputValues"
        placeholder="Ejemplo: nit\tnombre\tcodigo\tnumero"
        @focus="resetState"
        aria-describedby="input-help"
      />
      <small id="input-help">Cada fila debe tener 4 valores separados por tabulaciones.</small>
      <button @click="resetState" aria-label="Borrar todo el contenido">🗑️ Borrar todo</button>
    </div>
    <div class="cards-container">
      <div
        v-for="(item, index) in items"
        :key="`${item.nit}-${item.numero}`"
        class="card"
        :class="{ visited: isVisited(item) }"
        role="article"
        :aria-label="`Factura de ${item.nombre}, NIT ${item.nit}`"
      >
        <div class="card-content">
          <p><strong>NIT:</strong> {{ item.nit }}</p>
          <p><strong>Nombre:</strong> {{ item.nombre }}</p>
          <p><strong>Código:</strong> {{ item.codigo }}</p>
          <p><strong>Número:</strong> {{ item.numero }}</p>
        </div>
        <button @click="goToInvoice(item)" :aria-label="`Ir a factura de ${item.nombre}`">🔗 Ir a factura</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #fff;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

label {
  align-self: flex-start;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

textarea {
  width: 100%;
  height: 120px;
  resize: vertical;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

textarea:focus {
  outline: none;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(102, 126, 234, 0.5);
}

small {
  align-self: flex-start;
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: #fff;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  margin: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #333;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.card-content {
  margin-bottom: 1.5rem;
  text-align: center;
  width: 100%;
}

.card-content p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.card-content p strong {
  color: #667eea;
}

.visited {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  color: #d63031;
  border: 2px solid #e17055;
}

.visited .card-content p strong {
  color: #d63031;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .input-section {
    padding: 1.5rem;
  }
  .cards-container {
    grid-template-columns: 1fr;
  }
  .card {
    padding: 1.5rem;
  }
}
</style>
