import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use /grimwild-ukr/ for production build, / for dev server
  const base = command === 'build' ? '/grimwild-ukr/' : '/';
  
  return {
    plugins: [react()],
    base,
    server: {
      fs: {
        allow: ['..']
      }
    }
  };
})
