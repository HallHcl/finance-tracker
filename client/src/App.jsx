import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent"; // 🔥 แยก

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;