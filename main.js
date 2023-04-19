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

let timer;

const handleInput = async (input) => {
  const resultField = document.querySelector("#result-field");

  let formatValid = checkUrlFormat(input);
  if (formatValid === true) {
    let serverResponse = await throttledQueryServer(input);
    if (serverResponse !== undefined) {
      if (serverResponse === false) {
        resultField.innerText =
          "The input is a valid url but could not be found in the database";
        resultField.classList.remove("green");
        resultField.classList.remove("red");
        resultField.classList.add("yellow");
      } else if (
        serverResponse !== undefined &&
        typeof serverResponse === "object"
      ) {
        resultField.innerText =
          "The entered url is valid and points to a " + serverResponse.type;
        resultField.classList.remove("red");
        resultField.classList.remove("yellow");
        resultField.classList.add("green");
      }
    } else {
      resultField.innerText = "You can only check a url every two seconds";
      resultField.classList.remove("green");
      resultField.classList.remove("red");
      resultField.classList.add("yellow");
      clearTimeout(timer);
      timer = setTimeout(
        handleInput,
        1000,
        document.querySelector("#url-input").value
      );
    }
  } else {
    resultField.innerText = "The input is not a valid url";
    resultField.classList.remove("green");
    resultField.classList.remove("yellow");
    resultField.classList.add("red");
  }
};

const throttle = (fn, delay) => {
  let lastCalled = 0;
  return (...args) => {
    let now = new Date().getTime();
    if (now - lastCalled < delay) {
      return;
    }
    lastCalled = now;
    return fn(...args);
  };
};

const queryServer = async (input) => {
  let result = false;
  await fetch("http://localhost:3000/urls")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el) => {
        if (el.url === input) {
          result = el;
        }
      });
    });
  console.log("server called");
  return result;
};

const throttledQueryServer = throttle(queryServer, 2000);
