// color design tokens export
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
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
    selectBackground: "#266798"
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
  // Add gradients with semantic naming
  gradients: {
    primary: {
      default: [
        "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 27%, rgba(38,62,155,1) 63%, rgba(38,62,154,1) 72%, rgba(24,64,170,1) 100%)",
        "linear-gradient(43deg, #2039ba 0%, #3531b8 46%, #60b6e9 100%)",
        "linear-gradient(to right, #000428, #004e92); ",
        "linear-gradient(to top, #09203f, #537895 100%);",
        "linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)",
        "linear-gradient(to right, #2b5876 0%, #4e4376 100%)",
      ],
      alt: [
        "linear-gradient(120deg, #ff9a9e 0%, #fad0c4 100%)",
        "linear-gradient(to right, #ff7e5f, #feb47b)",
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
      // Don't reverse gradients, just copy them
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
tokensLight.primary.selectBackground = "#e8f0fe";

// Helper functions for working with gradients
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
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
            select: { background: tokensDark.primary.selectBackground },
            // Add gradients to palette
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
            // Add gradients to palette for light mode too
            gradients: tokensLight.gradients,
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 36,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 28,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    // Add custom utility methods to the theme
    utils: {
      getGradient: (path, index) => (theme) => getGradient(theme, path, index),
    }
  };
};