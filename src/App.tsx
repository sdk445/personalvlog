import React from "react";
import "./App.css";
import Terminal from "./components/Terminal";

const getYear = () => {
  return new Date().getFullYear();
};

const welcomeMessage = `Welcome to my site .

While I’m over here struggling to center a div, you can try out a few commands. 
Type ‘help’ to see what’s available.
`;

const bannerCondensed  =


"      _     _                              \n " +
"     | |   (_)                             \n " +
"  ___| |__  _ _ __  _ __ ___   ___  _   _  \n " +
" / __| '_ )| | '_ )| '_ ` _ ) / _ )| | | | \n " +
"| (__| | | | | | | | | | | | | (_) | |_| | \n " +
" (___|_| |_|_|_| |_|_| |_| |_|(___) (__, | \n " +
"                                     __) |                   \n"+
"                                      |___)                    \n"+
"  \u00A9 " +
  getYear();
 

const prompt = "user@Xnimbus:~$";

function App() {
  return (
    <Terminal
      welcomeMessage={welcomeMessage}
      banner={bannerCondensed}
      terminalPrompt={prompt}
    />
  );
}

export default App;
