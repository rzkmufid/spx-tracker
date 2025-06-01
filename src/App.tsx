import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout';
import TrackingPage from '@/components/tracking-page';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Layout>
        <TrackingPage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;