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
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { resetQuiz as resetGrammarQuiz } from "../../../../state/slices/grammerQuizSlice";
import { resetQuiz as resetVocabQuiz } from "../../../../state/slices/vocabQuizSlice";
import FlexBetween from "../../../../components/flexbetween/index";
import profileImage from "../../../../assets/guestprofilepic.png";

const navItems = [
    {
      text: "Dashboard",
      icon: <HomeOutlined />,
      path: "dashboard" 
    },
    {
      text: "Features",
      icon: null,   
    },
    {
      text: "Vocabulary",
      icon: <MenuBookOutlined />,
      feature: "vocabulary"
    },
    {
      text: "Speech",
      icon: <MicOutlined />,
      feature: "speech"
    },
    {
      text: "Speech Shadow",
      icon: <RecordVoiceOverOutlined />,
      feature: "speech-shadow"
    },
    {
      text: "Quiz",
      icon: <QuizOutlined />,
      feature: "quiz"
    },
    {
      text: "Grammar",
      icon: <GradeOutlined />,
      feature: "grammar"
    },
    {
        text: "Stats Overview",
        icon: <SettingsOutlined />,
        feature: "statsoverview"
    }
];

const Sidebar = ({
    user,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    
    // Determine active item based on current URL and search params
    const [active, setActive] = useState("");
    
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const lastPathPart = pathParts[pathParts.length - 1];
        
        if (lastPathPart === 'dashboard') {
            const feature = searchParams.get('feature');
            if (feature) {
                setActive(feature);
            } else {
                setActive('dashboard');
            }
        } else {
            setActive(lastPathPart);
        }
    }, [location, searchParams]);

    // Determine the base path based on user role
    const getBasePath = () => {
        if (!user || !user.role) return '/guest';
        
        switch(user.role.toLowerCase()) {
            case 'subscriber':
                return '/subscriber';
            case 'admin':
                return '/admin';
            default:
                return '/guest';
        }
    };

    const handleNavigation = (text, lcText, feature) => {
        const basePath = getBasePath();
        
        // Reset relevant state if needed
        if (active === "grammar" && lcText !== "grammar") {
            dispatch(resetGrammarQuiz());
        }
        
        if (active === "quiz" && lcText !== "quiz") {
            dispatch(resetVocabQuiz());
        }
        
        // Handle navigation based on type
        if (text === "Dashboard") {
            // Use full page refresh only for the main dashboard
            window.location.href = `${basePath}/dashboard`;
            return;
        }
        
        // Handle feature navigation with standard React Router
        if (feature) {
            // Reset quiz states if needed
            if (active === "grammar") {
                dispatch(resetGrammarQuiz());
            }
            if (active === "quiz") {
                dispatch(resetVocabQuiz());
            }
            
            // Use standard React Router navigation for features
            navigate(`${basePath}/dashboard?feature=${feature}`);
            setActive(feature);
        } else {
            // Handle other navigation items
            navigate(`/${lcText}`);
            setActive(lcText);
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
                            {navItems.map(({ text, icon, feature }) => {
                                if (!icon) {
                                    return (
                                        <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", color: 'white' }}>
                                            {text}
                                        </Typography>
                                    );
                                }

                                const lcText = text.toLowerCase();
                                const isActive = 
                                    (active === 'dashboard' && text === 'Dashboard') || 
                                    (active === feature);

                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={() => handleNavigation(text, lcText, feature)}
                                            sx={{
                                                backgroundColor: isActive
                                                    ? 'rgba(255, 255, 255, 0.3)'
                                                    : "transparent",
                                                color: 'white',
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: "2rem",
                                                    color: 'white',
                                                    opacity: isActive ? 1 : 0.8,
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} primaryTypographyProps={{ color: 'white' }} />
                                            {isActive && (
                                                <ChevronRightOutlined sx={{ ml: "auto", color: 'white' }} />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                );
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
    );
};

export default Sidebar;