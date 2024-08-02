import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import TerminalOutput from "./TerminalOutput";
import InputArea from "./InputArea";
import ErrorMessage from "./ErrorMessage";
import WelcomeMessage from "./WelcomeMessage";
import Arch from "./arch"

// Just a little helper function so I don't have to continually update my age
const getAge = (birthDate: Date) => {
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const downloadFile = (uri: string, downloadName: string) => {
  const link = document.createElement("a");
  link.download = downloadName;
  link.href = uri;
  link.click();
  link.remove();
};

type TerminalProps = {
  terminalPrompt?: string;
  banner?: string;
  welcomeMessage?: string;
};
const Terminal = (props: TerminalProps) => {
  const { terminalPrompt = "user@xnimbus >", banner, welcomeMessage } = props;
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(3);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const scrollLastCommandTop = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(scrollLastCommandTop, [output]);

  const echoCommands = [
    "help",
    "about",
    "contact",
    "dark",
    "pfm"
  ] as const;
  type EchoCommand = typeof echoCommands[number];
  const utilityCommands = ["clear", "all"] as const;
  type UtilityCommand = typeof utilityCommands[number];
  const allCommands = [...echoCommands, ...utilityCommands] as const;
  type Command = typeof allCommands[number];

  function isEchoCommand(arg: string): arg is EchoCommand {
    return (echoCommands as ReadonlyArray<string>).includes(arg);
  }

  function isUtilityCommand(arg: string): arg is UtilityCommand {
    return (utilityCommands as ReadonlyArray<string>).includes(arg);
  }

  function isValidCommand(arg: string): arg is Command {
    return isEchoCommand(arg) || isUtilityCommand(arg);
  }

  const glow = (text: string) => {
    return <span className="terminal-glow">{text}</span>;
  };

  const commands: { [key in EchoCommand]: JSX.Element } = {
    help: (
      <div>
        <p>
        Just type any of the commands below. I’ll be adding more soon!
        </p>
        <dl>
          <dt>about</dt>
          <dd>more about me</dd>
          <dt>contact</dt>
          <dd>show contact </dd>
          <dt>dark</dt>
          <dd>Find me in the darknet</dd>
          <dt>PFM</dt>
          <dd>Please flex for me</dd>
        </dl>
      </div>
    ),
    about: (
      <div>
        <p>
          Hey there! Thanks for taking such a keen interest in me.
        </p>
        <p>
          As you probably know, my name is {glow("Chinmoy Das")}. I'm a{" "}
          {getAge(new Date(1999, 9, 26))} year old {glow("Computer Enthusiast")}{" "}
        </p>
        <p>
          a self-taught developer who’s obsessed with backend dev. I didn’t get my coding skills from a fancy school—I learned them the old-fashioned way: through trial, error,and about a million pieces of my hair!
          <br />
          <br />

          I’m all about making sure things run smoothly behind the scenes. From building APIs to wrangling databases, I love transforming messy requirements into sleek, functional solutions. And yes, I also dip my toes sometimes into frontend work to ensure everything looks as good as it works.
          <br />
          <br />

          When I’m not glued to my computer, you might find me hanging out in tech forums, experimenting with new languages, or just geeking out over the latest trends. I’m always up for a tech chat or a new challenge, so if you want to collaborate or just swap coding stories, drop me a line!


        </p>
      </div>
    ),

    contact: (
      <>
        <dl>
          <dt>Email</dt>
          <dd>
            <a href="mailto:chinubist445@gmail.com">chinubist445@gmail.com</a>
          </dd>
          <dt>hometown</dt>
          <dd>Bankura 722140 WestBengal</dd>
          <dt>Bumble</dt>
          <dd>just kidding</dd>
        </dl>
      </>
    ),
    dark: (
      <>
        <dl>

          <dt>Tor</dt>
          <dd>http://huliohvdwzobcekpnjdqcrq7g3y2pljktb76mrmm54gn5t2kryqg72qd.onion/</dd>

        </dl>
      </>
    ),
    pfm: (
      <>
        <dl>

          <dt>Sure</dt>
          <dd>I use Arch btw!</dd>

        </dl>
      </>
    ),


  };

  const processCommand = (input: string) => {

    // Store a record of this command with a ref to allow us to scroll it into view.
    // Note: We use a ref callback here because setting the ref directly, then clearing output seems to set the ref to null.
    const commandRecord = (
      <div
        ref={(el) => (scrollRef.current = el)}
        className="terminal-command-record"
      >
        <span className="terminal-prompt">{terminalPrompt}</span>{" "}
        <span>{input}</span>
      </div>
    );

    // Add command to to history if the command is not empty
    if (input.trim()) {
      setHistory([...history, input]);
      setHistoryIndex(history.length + 1);
    }

    // Now process command, ignoring case
    const inputCommand = input.toLowerCase();
    if (!isValidCommand(inputCommand)) {
      setOutput([
        ...output,
        commandRecord,
        <div className="terminal-command-output">
          <ErrorMessage command={inputCommand} />
        </div>,
      ]);
    } else if (isEchoCommand(inputCommand)) {
      setOutput([
        ...output,
        commandRecord,
        <div className="terminal-command-output">{commands[inputCommand]}</div>,
      ]);
    } else if (isUtilityCommand(inputCommand)) {
      switch (inputCommand) {
        case "clear": {
          setOutput([]);
          break;
        }
        case "all": {
          // Output all commands in a custom order.
          const allCommandsOutput = [
            "about",
            "contact",
            "dark",
            "PFM"
          ].map((command) => (
            <>
              <div className="terminal-heading">{command}</div>
              <div className="terminal-command-output">
                {commands[command as EchoCommand]}
              </div>
            </>
          ));

          setOutput([commandRecord, ...allCommandsOutput]);
          break;
        }
      }
    }
  };

  const getHistory = (direction: "up" | "down") => {
    let updatedIndex;
    if (direction === "up") {
      updatedIndex = historyIndex === 0 ? 0 : historyIndex - 1;
    } else {
      updatedIndex =
        historyIndex === history.length ? history.length : historyIndex + 1;
    }
    setHistoryIndex(updatedIndex);
    return updatedIndex === history.length ? "" : history[updatedIndex];
  };

  const getAutocomplete = (input: string) => {
    const matchingCommands = allCommands.filter((c) => c.startsWith(input));
    if (matchingCommands.length === 1) {
      return matchingCommands[0];
    } else {
      const commandRecord = (
        <div
          ref={(el) => (scrollRef.current = el)}
          className="terminal-command-record"
        >
          <span className="terminal-prompt">{terminalPrompt}</span>{" "}
          <span>{input}</span>
        </div>
      );
      setOutput([...output, commandRecord, matchingCommands.join("    ")]);
      return input;
    }
  };

  const focusOnInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      // Prevent tab from moving focus
      event.preventDefault();
    }
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-container" tabIndex={-1} onKeyDown={focusOnInput}>
      <div className="terminal-content">
        {/* <Arch/> */}
        {banner && <Banner banner={banner} />}
        {welcomeMessage && (
          <WelcomeMessage message={welcomeMessage} inputRef={inputRef} />
        )}
        <TerminalOutput outputs={output} />
        <InputArea
          setOutput={setOutput}
          processCommand={processCommand}
          getHistory={getHistory}
          getAutocomplete={getAutocomplete}
          inputRef={inputRef}
          terminalPrompt={terminalPrompt}
        />
      </div>
    </div>
  );
};

export default Terminal;
