import React from 'react';
import { createRoot } from 'react-dom/client';
import ShoppingCartApp from './components/ShoppingCartApp';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ShoppingCartApp />);