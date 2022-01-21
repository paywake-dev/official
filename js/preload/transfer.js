const BALANCE = parseInt(localStorage.getItem(LOCAL_STORAGE_TAG + "balance") || "0")
let DESTINATION = 0

const selectDestination = (obj) => {
  DESTINATION = (parseInt(obj.id.split("-")[1]) || 0)
  $(".destination-container > .option").removeClass("selected")
  $("#destination-" + DESTINATION.toString()).addClass("selected")
  localStorage.setItem(LOCAL_STORAGE_TAG + "destination", DESTINATION)
  if (DESTINATION === 1) {
    $("#details-title")[0].innerHTML = "Venmo Account Phone Number"
    $(".__bank").addClass("hidden")
    $(".__venmo").removeClass("hidden")
  }
  else {
    $("#details-title")[0].innerHTML = "Bank Account Details"
    $(".__venmo").addClass("hidden")
    $(".__bank").removeClass("hidden")
  }
  updateTransferButton()
}

const slider = (obj, userInputted = false) => {
  let transfer = Math.round(obj.value)
  document.getElementById("transfer-amount").value = balanceToString(transfer)
  adjustTransferInput(document.getElementById("transfer-amount"))
}

const transferInput = (obj) => {
  const element = document.getElementById("transfer-slider")
  element.value = Math.min(Math.max((Math.round(parseFloat(obj.value) * 100) || 0), 0), BALANCE)
  slider(element, true)
}

const adjustTransferInput = (obj) => {
  let numberOfOnes = 0
  for (let i = 0; i < obj.value.toString().length; i++) {
    if (obj.value.toString().charAt(i) === "1") {
      numberOfOnes++
    }
  }
  const numbers = (obj.value.toString().length - 1)
  obj.style.width = (Math.max((((numbers - numberOfOnes) * 36) + ((numberOfOnes + 1) * 16) + (16)), 112).toString() + "px")
  updateTransferButton()
}

const updateTransferButton = () => {
  let amount = document.getElementById("transfer-slider").value
  const button = $("#transfer-button")[0]
  if (DESTINATION === 1) {
    amount -= 25;
  }
  if (amount < 0) {
    amount = 0
  }
  button.innerHTML = ("Transfer $" + balanceToString(amount))
  if (amount < 1) {
    button.setAttribute("disabled", true)
  }
  else {
    button.removeAttribute("disabled")
  }
}

const balanceToString = (balance = BALANCE) => {
  return Math.floor(balance / 100).toString() + "." + (balance % 100).toString().padStart(2, "0")
}

const setMaxTransfer = () => {
  $("#transfer-amount")[0].maxLength = (Math.floor(BALANCE / 100).toString().length + 3)
  $("#transfer-slider")[0].max = BALANCE
  $("#max-transfer").text("$" + balanceToString(BALANCE))
}

const setUSStates = () => {
  for (let state in US_STATES) {
    let option = document.createElement("option")
    option.innerHTML = US_STATES[state]
    option.value = state
    document.getElementById("address-state").add(option)
  }
}

const verifyPhone = (obj) => {
  const phone = cleanPhone(obj.value)
  if (phone.length === 10) {
    obj.removeAttribute("invalid")
    return phone
  }
  obj.setAttribute("invalid", "true")
  return false;
}

const verifyText = (obj) => {
  const text = obj.value.toString().trim()
  if (text.length) {
    obj.removeAttribute("invalid")
    return text
  }
  obj.setAttribute("invalid", "true")
  return false;
}

const verifyTransfer = () => {
  if (DESTINATION === 0) {
    if (
      verifyText($("#account-number")[0]) &&
      verifyText($("#routing-number")[0]) &&
      verifyText($("#account-type")[0]) &&
      verifyText($("#address-line-1")[0]) &&
      verifyText($("#address-line-2")[0]) &&
      verifyText($("#address-city")[0]) &&
      verifyText($("#address-state")[0])
    ) {
      return true;
    }
    return false;
  }
  else {
    if (verifyPhone($("#phone")[0])) {
      return true;
    }
    return false;
  }
}

const transfer = () => {
  if (parseInt($("#transfer-slider")[0].value)) {
    let payload = {
      type: "VENMO",
      amount: parseInt($("#transfer-slider")[0].value),
      data: {
        phone: $("#phone")[0].value.toString().trim(),
      },
    }
    if (DESTINATION === 0) {
      payload = {
        type: "BANK",
        amount: parseInt($("#transfer-slider")[0].value),
        data: {
          accountNumber: $("#account-number")[0].value.toString().trim(),
          routingNumber: $("#routing-number")[0].value.toString().trim(),
          accountType: $("#account-type")[0].value.toString().trim(),
          address: {
            line1: $("#address-line-1")[0].value.toString().trim(),
            line2: $("#address-line-2")[0].value.toString().trim(),
            city: $("#address-city")[0].value.toString().trim(),
            state: $("#address-state")[0].value.toString().trim(),
          },
        },
      }
    }
    if (verifyTransfer()) {
      $("#transfer-button").addClass("loading")
      $.ajax({
        url: (API + "/transfer"),
        type: "PUT",
        data: payload,
        xhrFields: {
          withCredentials: true
        },
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", ID_TOKEN)
        },
        success: (data) => {
          $("#transfer-button").removeClass("loading")
          transferSuccess()
        },
        error: (data) => {
          $("#transfer-button").removeClass("loading")
          transferError()
        }
      })
    }
  }
}

const transferError = () => {
  let elements = []
  let center = document.createElement("div")
  center.className = "center"
  let img = document.createElement("img")
  img.src = "assets/images/failed.png"
  center.appendChild(img)
  let title = document.createElement("h3")
  title.className = "center"
  if (DESTINATION === 1) {
    title.innerHTML = "Venmo Transfer Failed"
  }
  else {
    title.innerHTML = "Bank Transfer Failed"
  }
  title.style.marginBottom = "24px"
  let text = document.createElement("p")
  if (DESTINATION === 1) {
    text.innerHTML = ("Your <b>$" + balanceToString($("#transfer-slider")[0].value - 25) + "</b> transfer to Venmo failed. Please check your account details and try again.")
  }
  else {
    text.innerHTML = ("Your <b>$" + balanceToString($("#transfer-slider")[0].value) + "</b> bank transfer failed. Please check your account details and try again.")
  }
  elements.push(center)
  elements.push(title)
  elements.push(text)
  MODAL.display(elements)
}

const transferSuccess = () => {
  let elements = []
  let center = document.createElement("div")
  center.className = "center"
  let img = document.createElement("img")
  img.src = "assets/images/verified.png"
  center.appendChild(img)
  let title = document.createElement("h3")
  title.className = "center"
  if (DESTINATION === 1) {
    title.innerHTML = "Venmo Transfer Successful"
  }
  else {
    title.innerHTML = "Bank Transfer Pending"
  }
  title.style.marginBottom = "24px"
  let text = document.createElement("p")
  if (DESTINATION === 1) {
    text.innerHTML = ("Your <b>$" + balanceToString($("#transfer-slider")[0].value - 25) + "</b> transfer to Venmo was successful. The funds will show up in your Venmo account shortly.")
  }
  else {
    text.innerHTML = ("Your <b>$" + balanceToString($("#transfer-slider")[0].value) + "</b> bank transfer was initiated successfully. The funds will show up in your bank account within <b>1 to 3 business days</b>.")
  }
  elements.push(center)
  elements.push(title)
  elements.push(text)
  MODAL.display(elements)
  MODAL.hide = () => {
    MODAL.visible = false
    const backdrop = document.getElementById("__modal-backdrop")
    const container = document.getElementById("__modal-container")
    $(backdrop).removeClass("visible")
    $(container).removeClass("visible")
    leavePage()
  }
}
