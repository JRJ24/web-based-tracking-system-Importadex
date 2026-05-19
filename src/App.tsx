import { RouterProvider } from "react-router-dom";
import { TrackingProvider } from "./context/TrackingContext";
import { router } from "./router";

function App() {
  return (
    <TrackingProvider>
      <RouterProvider router={router} />
    </TrackingProvider>
  );
}

export default App;
