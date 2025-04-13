import React from 'react';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    MenuBookOutlined,
    MicOutlined,
    RecordVoiceOverOutlined,
    QuizOutlined,
    GradeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    ReceiptLongOutlined,
    PublicOutlined,
    PointOfSaleOutlined,
    TodayOutlined,
    CalendarMonthOutlined,
    AdminPanelSettingsOutlined,
    TrendingUpOutlined,
    PieChartOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../../../../components/flexbetween/index";
import profileImage from "../../../../assets/guestprofilepic.png";


const navItems = [
    {
      text: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      text: "Features",
      icon: null,
    },
    {
      text: "Vocabulary",
      icon: <MenuBookOutlined />, // You can choose appropriate icons
    },
    {
      text: "Speech",
      icon: <MicOutlined />,
    },
    {
      text: "Speech Shadow",
      icon: <RecordVoiceOverOutlined />,
    },
    {
      text: "Quiz",
      icon: <QuizOutlined />,
    },
    {
      text: "Grammar",
      icon: <GradeOutlined />,
    },
    // Add any other navigation items you need
  ];

  const Sidebar = ({
    user,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname]);

    // Determine the base path based on user role
    const getBasePath = () => {
        console.log("User in sidebar",user)
        if (!user || !user.role) return '/guest'; // Default if no user/role
        
        switch(user.role.toLowerCase()) {
            case 'subscriber':
                return '/subscriber';
            case 'admin':
                return '/admin';
            default:
                return '/guest';
        }
    };

    return (
        <Box component="nav">
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    variant={isNonMobile ? "persistent" : "temporary"}
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            color: 'white',
                            backgroundColor: "#176DC2",
                            boxSizing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width: drawerWidth,
                        },
                    }}
                >
                    <Box width="100%">
                        <Box m="1.5rem 2rem 2rem 3rem">
                            <FlexBetween>
                                <Box display="flex" alignItems="center" gap="0.5rem">
                                    <Typography variant="h4" fontWeight="bold" color="white">
                                        NEUROLINGVA
                                    </Typography>
                                </Box>
                                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: 'white' }}>
                                    <ChevronLeft />
                                </IconButton>
                            </FlexBetween>
                        </Box>
                        <List>
                            {navItems.map(({ text, icon }) => {
                                if (!icon) {
                                    return (
                                        <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", color: 'white' }}>
                                            {text}
                                        </Typography>
                                    );
                                }

                                const lcText = text.toLowerCase();

                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                // Handle feature clicks differently
                                                if (["vocabulary", "speech", "speech shadow", "quiz", "grammar"].includes(lcText.toLowerCase())) {
                                                    navigate(`${getBasePath()}/dashboard?feature=${lcText.toLowerCase().replace(" ", "-")}`);
                                                } else {
                                                    navigate(`/${lcText}`);
                                                }
                                                setActive(lcText);
                                            }}
                                            sx={{
                                                backgroundColor:
                                                active === lcText
                                                    ? 'rgba(255, 255, 255, 0.3)'
                                                    : "transparent",
                                                color: 'white',
                                            }}
                                            >
                                            <ListItemIcon
                                                sx={{
                                                    ml: "2rem",
                                                    color: 'white',
                                                    opacity: active === lcText ? 1 : 0.8,
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} primaryTypographyProps={{ color: 'white' }} />
                                            {active === lcText && (
                                                <ChevronRightOutlined sx={{ ml: "auto", color: 'white' }} />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>

                    <Box mb="2rem">
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                            <Box
                                component="img"
                                alt="profile"
                                src={profileImage}
                                height="40px"
                                width="40px"
                                borderRadius="50%"
                                sx={{ objectFit: "cover" }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight="bold"
                                    fontSize="0.9rem"
                                    color="white"
                                >
                                    {user?.name}
                                </Typography>
                                <Typography
                                    fontSize="0.8rem"
                                    color="white"
                                    sx={{ opacity: 0.8 }}
                                >
                                    {user?.occupation}
                                </Typography>
                            </Box>
                            <SettingsOutlined
                                sx={{
                                    color: 'white',
                                    fontSize: "25px",
                                    opacity: 0.8,
                                }}
                            />
                        </FlexBetween>
                    </Box>
                </Drawer>
            )}
        </Box>
    )
}

export default Sidebar;