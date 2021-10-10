const stripe = Stripe("pk_test_51JUdOkLpUT5ZEdXBfLc7zrtfyF0ZExQDolGH78FwUuRIC3O2qPalOclEL8mCNISHrXhGuxNA7mX17ARbY28hsvMT00QUcJY6MC")

const logout = () => {
  ROUTINES.logout()
}

let MONTH_RETURN = 8
let TODAY_RETURN = 12
let RETURN_TOGGLE = 1

const slider = (obj) => {
  let historic = MONTH_RETURN
  if (RETURN_TOGGLE) {
    historic = TODAY_RETURN
  }
  const deposit = Math.round(obj.value)
  const returns = (Math.floor(deposit * ((historic / 100) + 1) * 100) / 100)
  document.getElementById("deposit-amount").innerHTML = deposit.toString()
  document.getElementById("return-amount").innerHTML = Math.floor(returns).toString()
  document.getElementById("return-amount-cents").innerHTML = ("." + Math.round((returns - Math.floor(returns)) * 100).toString().padEnd(2, "0"))
}

const sliderInit = (obj) => {
  const steps = 60
  const finalPosition = (Math.floor(Math.random() * (SLIDER_INIT_MAX - SLIDER_INIT_MIN)) + SLIDER_INIT_MIN)
  const duration = ((SLIDER_DURATION_MS / SLIDER_INIT_MAX) * finalPosition)
  let counter = 0
  obj.value = 5
  slider(obj)
  const interval = setInterval(() => {
    if (counter < steps) {
      obj.value = (5 + ((finalPosition - 5) * Math.pow((counter / steps), (1 / 3))))
      slider(obj)
      counter++
    }
    else {
      obj.value = finalPosition
      slider(obj)
      clearInterval(interval)
    }
  }, (duration / steps))
}

const estimateAlert = () => {
  const deposit = Math.round(document.getElementsByClassName("slider")[0].value)
  const returns =  (Math.floor(deposit * ((ESTIMATED_RETURN / 100) + 1) * 100) / 100)
  const dollarString = (Math.floor(returns).toString() + ("." + Math.round((returns - Math.floor(returns)) * 100).toString().padEnd(2, "0")))
  const text = ("This $" + dollarString + " average return is based on the last 30 days of Paywake user data.")
  alert(text)
}

const set1DayReturns = () => {
  RETURN_TOGGLE = 1
  $("#1d-button").addClass("active")
  $("#30d-button").removeClass("active")
  document.getElementById("1d-30d-text").innerHTML = "Today,"
  slider(document.getElementById("estimate-slider"))
}

const set30DayReturns = () => {
  RETURN_TOGGLE = 0
  $("#30d-button").addClass("active")
  $("#1d-button").removeClass("active")
  document.getElementById("1d-30d-text").innerHTML = "In the last 30 days,"
  slider(document.getElementById("estimate-slider"))
}

const setBalance = (balance = 0) => {
  localStorage.setItem("__paywake-balance", balance.toString())
  const dollars = Math.floor(balance / 100)
  const cents = Math.floor(balance % 100)
  document.getElementById("balance-dollars").innerHTML = dollars.toString()
  document.getElementById("balance-cents").innerHTML = ("." + cents.toString().padEnd(2, "0"))
}

const fetchBalance = () => {
  $.ajax({
    url: (API + "/balance"),
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", ID_TOKEN)
    },
    success: (data) => {
      setBalance(data.balance)
    }
  })
}
