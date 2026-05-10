import { Outlet } from "react-router";

function App() {
  return (
    <div className="">
      <Sidebar/>
      <div>
        <Header/>
        <main>
          <Outlet/>
        </main>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
