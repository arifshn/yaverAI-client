import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Outlet />
    </div>
  );
}

export default App;
