document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.querySelector("#url-input");
  urlInput.addEventListener("input", (e) => {
    handleInput(e.target.value);
  });
  urlInput.focus();
});

const checkUrlFormat = (url) => {
  const regex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  if (url.match(regex)) {
    return true;
  } else {
    return false;
  }
};

const handleInput = async (input) => {
  const resultField = document.querySelector("#result-field");

  let formatValid = checkUrlFormat(input);
  if (formatValid === true) {
    resultField.innerText = "The input is a valid url";
    resultField.classList.remove("yellow");
    resultField.classList.remove("red");
    resultField.classList.add("green");
    await throttledDbResponse(input);
  } else {
    resultField.innerText = "The input is not a valid url";
    resultField.classList.remove("green");
    resultField.classList.remove("yellow");
    resultField.classList.add("red");
  }
};

const throttle = (fn, delay) => {
  let wait = false;
  let storedArgs = null;

  function checkStoredArgs() {
    if (storedArgs == null) {
      wait = false;
    } else {
      fn(...storedArgs);
      storedArgs = null;
      setTimeout(checkStoredArgs, delay);
    }
  }

  return (...args) => {
    if (wait) {
      storedArgs = args;
      return;
    }

    fn(...args);
    wait = true;
    setTimeout(checkStoredArgs, delay);
  };
};

const dbResponse = async (input) => {
  const resultField = document.querySelector("#result-field");
  let serverResponse = await queryServer(input);
  if (serverResponse === false) {
    resultField.innerText += "  but could not be found in the database";
    resultField.classList.remove("green");
    resultField.classList.remove("red");
    resultField.classList.add("yellow");
  } else if (
    serverResponse !== undefined &&
    typeof serverResponse === "object"
  ) {
    resultField.innerText += "  and points to a " + serverResponse.type;
  }
};

const throttledDbResponse = throttle(dbResponse, 2000);

const queryServer = async (input) => {
  let result = false;
  await fetch("./db.json")
    .then((response) => response.json())
    .then((data) => {
      data.urls.forEach((el) => {
        if (el.url === input) {
          result = el;
        }
      });
    });
  const now = new Date();
  console.log("server called at " + now);
  return result;
};
