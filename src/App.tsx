import { Home } from '@pages';
import { ThemeProvider } from "@providers";
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
       <Route path='/' element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
