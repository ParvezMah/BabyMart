import { Navigate, Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./lib/utils";
import useAuthStore from "./store/useAuthStore";
import { useState } from "react";


function App() {
  
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  if(!isAuthenticated) {
    return <Navigate to={"/login"}/>
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
        <div className={cn(
            "flex flex-col flex-1 max-w-[--breakpoint-2xl]",
            sidebarOpen ? "md:ml-64" : "md:ml-20"
          )}
        >
        <div className="flex flex-col flex-1 max-w-[--breakpoint-2xl] ml-64">
        <Header/>
        <main>
          <Outlet/>
        </main>
        </div>
        <Toaster position="bottom-right"/>
      </div>
    </div>
  );
}

export default App;
