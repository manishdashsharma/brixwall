import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/query.js';
import GameScreen from './GameScreen.jsx';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameScreen />
    </QueryClientProvider>
  );
}
