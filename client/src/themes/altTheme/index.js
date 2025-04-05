// color design tokens export - Green/Purple Theme
export const tokensDark = {
    grey: {
      0: "#ffffff", // manually adjusted
      10: "#f6f6f6", // manually adjusted
      50: "#f0f0f0", // manually adjusted
      100: "#e0e0e0",
      200: "#c2c2c2",
      300: "#a3a3a3",
      400: "#858585",
      500: "#666666",
      600: "#525252",
      700: "#3d3d3d",
      800: "#292929",
      900: "#141414",
      1000: "#000000", // manually adjusted
    },
    primary: {
      // green
      100: "#d8f3dc",
      200: "#b7e4c7",
      300: "#95d5b2",
      400: "#74c69d",
      500: "#52b788",
      600: "#40916c",
      700: "#2d6a4f",
      800: "#1b4332",
      900: "#081c15",
      selectBackground: "#2d6a4f"
    },
    secondary: {
        50: "#fdf5f2",
        100: "#fae8e0",
        200: "#f5d5c2",
        300: "#e9b89b",
        400: "#dd9b74",  // Base
        500: "#c77d5a",  // Optimal contrast
        600: "#a16348",
        700: "#7a4a36",
        800: "#533124",
        900: "#2d1912"
      },
    gradients: {
      primary: {
        default: [
          "linear-gradient(90deg, rgba(8,28,21,1) 0%, rgba(45,106,79,1) 50%, rgba(210,255,231,1) 100%)",
          "linear-gradient(43deg, #081c15 0%, #1b4332 46%, #52b788 100%)",
          "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
          "linear-gradient(to top, #0a192f, #172a45 100%)",
          "linear-gradient(-20deg, #0f2027 0%, #203a43 50%, #2c5364 100%)"
        ],
        alt: [
          "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
          "linear-gradient(to right, #a1c4fd, #c2e9fb)",
          "#f0f0f0", // fallback solid color
        ],
      },
    },
  };
  
  // function that reverses the color palette
  function reverseTokens(tokensDark) {
    const reversedTokens = {};
    Object.entries(tokensDark).forEach(([key, val]) => {
      if (key === 'gradients') {
        reversedTokens[key] = { ...val };
        return;
      }
      
      const keys = Object.keys(val);
      const values = Object.values(val);
      const length = keys.length;
      const reversedObj = {};
      for (let i = 0; i < length; i++) {
        reversedObj[keys[i]] = values[length - i - 1];
      }
      reversedTokens[key] = reversedObj;
    });
    return reversedTokens;
  }
  
  export const tokensLight = reverseTokens(tokensDark);
  tokensLight.primary.selectBackground = "#e8f5e9";


  export const getGradient = (theme, path, index = 0) => {
    try {
      const gradientArray = path.split('.').reduce(
        (obj, key) => obj[key], 
        theme.palette.gradients
      );
      return gradientArray[index] || gradientArray[0];
    } catch (e) {
      // Fallback to a default color if the gradient doesn't exist
      return theme.palette.background.default;
    }
  };
  
  // mui theme settings
  export const themeSettings = (mode) => {
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              // palette values for dark mode
              primary: {
                ...tokensDark.primary,
                main: tokensDark.primary[400],
                light: tokensDark.primary[300],
              },
              secondary: {
                ...tokensDark.secondary,
                main: tokensDark.secondary[400],
              },
              neutral: {
                ...tokensDark.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.primary[800],
                alt: tokensDark.primary[700],
              },
              select: { background: tokensDark.primary.selectBackground },
              gradients: tokensDark.gradients,
            }
          : {
              // palette values for light mode
              primary: {
                ...tokensLight.primary,
                main: tokensDark.grey[50],
                light: tokensDark.grey[100],
              },
              secondary: {
                ...tokensLight.secondary,
                main: tokensDark.secondary[600],
                light: tokensDark.secondary[700],
              },
              neutral: {
                ...tokensLight.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.grey[0],
                alt: tokensDark.grey[50],
              },
              select: { background: tokensLight.primary.selectBackground },
              gradients: tokensLight.gradients,
            }),
      },
      typography: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 36,
          fontWeight: 600,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[900]
        },
        h2: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 28,
          fontWeight: 600,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[800]
        },
        h3: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 24,
          fontWeight: 500,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[800]
        },
        h4: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 20,
          fontWeight: 500,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[700]
        },
        h5: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 16,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[700]
        },
        h6: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 14,
          color: mode === "dark" ? tokensDark.grey[100] : tokensDark.grey[700]
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              padding: "8px 16px",
            },
            containedPrimary: {
              "&:hover": {
                backgroundColor: mode === "dark" 
                  ? tokensDark.primary[300] 
                  : tokensDark.primary[600],
              },
            },
            containedSecondary: {
              "&:hover": {
                backgroundColor: mode === "dark" 
                  ? tokensDark.secondary[300] 
                  : tokensDark.secondary[700],
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              background: mode === "dark" 
                ? tokensDark.primary[700] 
                : tokensDark.grey[100],
            },
          },
        },
      },
      utils: {
        getGradient: (path, index) => (theme) => getGradient(theme, path, index),
      }
    };
  };