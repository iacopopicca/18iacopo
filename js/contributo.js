var contributo;

window.addEventListener("DOMContentLoaded", init);

function init() {
  contributo = document.getElementById("contributo-modal");

  enableIdBtn("contr-btn");

  // EVENT LISTENERS

  // checkout
  var ch_forms = document.querySelectorAll("#checkout-form");
  for (var i = 0; i < ch_forms.length; i++) {
    ch_forms[i].addEventListener("submit", handleFormSubmit, false);
  }

  // payment method
  var radios = document.forms["checkout-form"].elements["metodo"];
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener("click", setPaymentMethod, false);
  }
}

// CHECKOUT
function retrieveContributo() {
  var priceList = {};
  var price = document.getElementsByClassName("prod-price")[0].value;
  priceList["contributo"] = parseFloat(price);
  return priceList;
}

function getFormData(form) {
  var elements = form.elements;
  var fields = Object.keys(elements)
    .map(function (k) {
      if (elements[k].name !== undefined) {
        return elements[k].name;
        // special case for Edge's html collection
      } else if (elements[k].length > 0) {
        return elements[k].item(0).name;
      }
    })
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
  var formData = {};
  fields.forEach(function (name) {
    var element = elements[name];
    // singular form elements just have one value
    formData[name] = element.value;
    // when our element has multiple items, get their values
    if (element.length) {
      var data = [];
      for (var i = 0; i < element.length; i++) {
        var item = element.item(i);
        if (item.checked || item.selected) {
          data.push(item.value);
        }
      }
      formData[name] = data.join(", ");
    }
  });
  // retrieve contributo
  formData = Object.assign(formData, retrieveContributo());
  console.log(formData);
  return { data: formData };
}

function handleFormSubmit(event) {
  // handles form submit without any jquery
  event.preventDefault(); // we are submitting via xhr below
  var form = event.target;
  var formData = getFormData(form);
  var data = formData.data;
  disableAllButtons("confirm-btn");
  var url = form.action;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      form.reset();
      var formElements = form.querySelector(".form-elements");
      if (formElements) {
        formElements.style.display = "none"; // hide form
      }
      var thankYouMessage = document.querySelector(".thankyou_message");
      if (thankYouMessage) {
        // confetti.start(6000, 20, 100);
        thankYouMessage.style.display = "block";
      }
    }
  };
  // url encode form data for sending as post data
  var encoded = Object.keys(data)
    .map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    })
    .join("&");
  xhr.send(encoded);
}

// check radio buttons to set payment method
function setPaymentMethod(event) {
  if (event.target.id == "radio-paypal") {
    methods = document.getElementsByClassName("method-confirm");
    for (let i = 0; i < methods.length; i++) methods[i].innerHTML = "Paypal";
    document.getElementsByClassName("scelta-paypal")[0].style.display = "block";
    document.getElementsByClassName("scelta-bonifico")[0].style.display = "none";
  } else if (event.target.id == "radio-bonifico") {
    methods = document.getElementsByClassName("method-confirm");
    for (let i = 0; i < methods.length; i++) methods[i].innerHTML = "Bonifico";
    document.getElementsByClassName("scelta-paypal")[0].style.display = "none";
    document.getElementsByClassName("scelta-bonifico")[0].style.display = "block";
  }
}

// double confirmation form functions
function confirmfinish() {
  str = ["confirm-body", "confirm-btn", "checkout-btn"];
  for (let i = 0; i < str.length; i++) {
    elem = document.getElementsByClassName(str[i]);
    for (let j = 0; j < elem.length; j++) {
      const el = elem[j];
      if (i == 2) el.style.display = "none";
      else el.style.display = "block";
    }
  }
}

function confirm_no() {
  str = ["confirm-body", "confirm-btn", "checkout-btn"];
  for (let i = 0; i < str.length; i++) {
    elem = document.getElementsByClassName(str[i]);
    for (let j = 0; j < elem.length; j++) {
      const el = elem[j];
      if (i == 2) el.style.display = "block";
      else el.style.display = "none";
    }
  }
}

/****************** AUXILIARY FUNCTIONS ********************/

// enable and disable buttons
function disableClassBtn(product, classname) {
  product.getElementsByClassName(classname)[0].disabled = true;
}
function enableClassBtn(product, classname) {
  product.getElementsByClassName(classname)[0].disabled = false;
}
function disableIdBtn(id) {
  document.getElementById(id).disabled = true;
}
function enableIdBtn(id) {
  document.getElementById(id).disabled = false;
}

function disableAllButtons(classname) {
  var contents = document.getElementsByClassName(classname);
  for (let j = 0; j < contents.length; j++) {
    const content = contents[j];
    var buttons = content.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
}
