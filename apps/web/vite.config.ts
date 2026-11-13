import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],server:{proxy:{'/assets/':'http://127.0.0.1:8083','/api':'http://127.0.0.1:4181','/app':'http://127.0.0.1:8083'}},build:{outDir:'dist'}});
