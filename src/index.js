// Import stylesheets
import "./styles.css";

// Define variables
var fs = null;
var ver = null;
var fpath = null;
var input = "";
var split = {};
var verboseEnable = true;
// Kernel Panic
function panic(code) {
  // Print the panic to the DOM
  println(`kernel panic with code ` + code);
}

// Start the operating system
function start() {
  // Define the version
  ver = "r0.1";
  if (!ver) {
    // Kernel Panic if ver fails to initilize
    panic(7);
    // Check if verbose boot is enabled
    if (verboseEnable) {
      // Tell the user that the bootup process failed
      println('verbose: failed to init variable "ver"');
    }
  } else {
    // Check if verbose boot is enabled
    if (verboseEnable) {
      // Let the user know the variable has been initilalized
      println('verbose: successfully set variable "ver" to ' + ver);
      // Display a makeshift welcome
      println("verbose: webos version reported as " + ver);
    }
    // Define the current file path
    fpath = "\\";
    if (!fpath) {
      // Kernel Panic if fpath fails to initilize
      panic(7);
      // Check if verbose boot is enabled
      if (verboseEnable) {
        // Tell the user that the bootup process failed
        println('verbose: failed to init variable "fpath"');
      }
    } else {
      // Check if verbose boot is enabled
      if (verboseEnable) {
        // Let the user know the variable has been initilalized
        println('verbose: successfully set variable "fpath" to ' + fpath);
        // Let the user know that the file system being is being loaded
        println('verbose: trying to load "fs.json"');
      }
      // Terrible makeshift solution because I couldn't figure out how to import the JSON file
      fs = {
        root: {
          files: {
            "test.txt": "\\fs\\test.txt"
          },
          folders: {
            test: {
              files: {
                "othertest.txt": "\\fs\\test\\othertest.txt"
              },
              folders: {}
            }
          }
        }
      };
      if (!fs) {
        // Kernel Panic if fs fails to initilize
        panic(7);
        // Check if verbose boot is enabled
        if (verboseEnable) {
          // Let the user know the "file loading" has failed
          println('verbose: failed to load file "fs.json"');
        }
      } else {
        // Check if verbose boot is enabled
        if (verboseEnable) {
          // Alert the user that a ton of stuff is happening
          println('verbose: successfully loaded file "fs.json"');
          println("verbose: trying to construct file system");
          println("verbose: loading prompt");
          println("verbose: adding event listeners");
        }
        // Add a keydown event listener (aka keyboard driver)
        document.addEventListener(
          "keydown",
          (event) => {
            // Check if the event has already been handled
            if (event.defaultPrevented) {
              // Abort the function
              return;
            }
            // Check if the spacebar has been pressed
            if (event.keyCode === 32) {
              // Print a non-breaking space
              printHTML("&nbsp;");
              // Add the space to the internal
              input += " ";
              // Check if enter has been pressed
            } else if (event.keyCode === 13) {
              // console.log("Enter"); some debugging junk
              // Print a new line
              println("");
              // Send a handle request
              handleCommand(input);
              // Clear the input
              input = "";
              // Check if the delete key has been pressed
            } else if (event.keyCode === 8) {
              // Substring the input (tbh, pretty hacky)
              input = input.substring(0, input.length - 1);
              // Substring the DOM (even more hacky)
              document.getElementById(
                "kernelout"
              ).innerText = document
                .getElementById("kernelout")
                .innerText.substring(
                  0,
                  document.getElementById("kernelout").innerText.length - 1
                );
              // console.log(input); more debbuging junk
              // Check if the keycode is less than 31, to elimate characters like Control
            } else if (event.keyCode < 31) {
              // Abort the function
              return;
              // Check if the arrow keys have been pressed, as to not print them
            } else if (event.keyCode >= 37 && event.keyCode <= 40) {
              // Abort the function
              return;
              // Otherwise, handle the key normally
            } else {
              // Print the key to the DOM
              print(event.key);
              // Add the key to the internal field
              input += event.key;
            }
            // Prevent double-handling
            event.preventDefault();
          },
          false
        );
        // Check if verbose is disabled
        if (!verboseEnable) {
          // Print a better welcome message if so
          println("Welcome to WebOS " + ver + "!");
        }
        // Display the prompt
        displayOS();
      }
    }
  }
}

// Print function
function print(text) {
  // Add the text directly to the DOM
  document.getElementById("kernelout").innerText += text;
}

// Print HTML function
function printHTML(text) {
  // Add HTML data to the DOM
  document.getElementById("kernelout").innerHTML += text;
}
// Print line function
function println(text) {
  // Add line to the DOM
  document.getElementById("kernelout").innerText +=
    text /* Add a newline */ +
    `
  `;
}

// Prompt display
function displayOS() {
  // Print the prompt to the DOM
  printHTML(fpath + " $&nbsp;");
}

// Command handler
function handleCommand(input) {
  // Split the command by spaces
  split = input.split(" ");
  // Check if the "test" command was run
  if (split[0] === "kernel") {
    // Check if the path conversion test was run
    if (split[1] === "pathc") {
      // Print the result of the function to the DOM
      println(convertPath(fpath));
      // Check if the directory change test was run
    } else if (split[1] === "dirc") {
      // Change the path to the second argument
      fpath = split[2];
      // Check if the cmdlet list test was run
    } else if (split[1] === "cmds") {
      // Print the list of all of the supported cmdlets
      println("cmds, dirc, pathc, cls, panic");
      // Check if the screen clear test was run
    } else if (split[1] === "cls") {
      // Clear the DOM
      document.getElementById("kernelout").innerText = "";
      // Check if the variable set test was run
      // } else if (split[1] === "setvar") {
      //   // Set the variable specifed by the second argument to the third argument
      //   var a = eval(split[2]);
      //   eval(a + " = " + split[3]);
      //   // Add some graphical confromation
      //   println("Variable " + split[2] + "'s value has been set to " + split[3]);
      //   // console.log(window[split[2]]); more debugging junk
      //   // Check if the get variable test was run
      // } else if (split[1] === "getvar") {
      //   // Tell the user what the current value is
      //   println(
      //     "Variable " +
      //       split[2] +
      //       "'s value is currently set to " +
      //       eval(split[2])
      //   );
      // Check if the panic test tool was run
    } else if (split[1] === "panic") {
      // Panic
      panic(split[2]);
      // Check if the echo test tool was run
    } else if (split[1] === "echo") {
      // Print to the DOM
      println(split[2]);
      // Check if the user entered an invalid cmdlet name
    } else {
      // Tell the user how to get access to a list
      println("Invalid test cmdlet: use cmds for a list of test cmdlets.");
    }
    // Check if an invalid command is inputted
  } else {
    // Tell the user that they typed a invalid command
    println("Invalid Command");
  }
  // Print the prompt to the DOM
  printHTML(fpath + " $&nbsp;");
  // Clear the split variable
  split = {};
}

// Convert path function for convert path test tool
function convertPath(path) {
  // Split the path by backslashes
  var pathsplit = path.split("\\");
  // Add the variable name
  var r = "fs.root";
  // Loop through all of the subdirectories
  for (var i = 1; i < pathsplit.length; i++) {
    // Add a period
    r += ".";
    // Add the subdirectory name
    r += pathsplit[i];
  }
  // Quick hacky bug fix
  r = r.substring(0, r.length - 1);
  // Return the value
  return r;
}

// Run the start function
start();
// End of document
