import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../navbar/index.jsx";
import Sidebar from "../sidebar/index.jsx";



function AdminLayout() {

  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useSelector((state) => state.user);

 console.log("User data in admin layout",user)

  return (
      <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
        <Sidebar
        user={user || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}> 
        <Navbar 
         user={user || {}}
         isSidebarOpen={isSidebarOpen}
         setIsSidebarOpen={setIsSidebarOpen}  
        />

       <Outlet />
      </Box>
        
    </Box>
  )
}

export default AdminLayout