let RETURNS = ESTIMATED_RETURN

const slider = (obj) => {
  const deposit = Math.round(obj.value)
  const returns = ((Math.floor(deposit * ((RETURNS / 100) + 1) * 100) - 1) / 100)
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
  const dollarString = ($("#return-amount")[0].innerText + $("#return-amount-cents")[0].innerText)
  const text = ("This $" + dollarString + " average return is based on the last 30 days of Paywake user data and includes both the extra payment and refunded deposit amounts. This is not an earnings guarantee.")
  MODAL.hide()
  MODAL.displayHTML("<p>" + text + "</p>")
}

const getStartedClick = () => {
  document.getElementById("name").focus()
}

const scheduleClick = () => {
  if (USER === null) {
    leavePage("./create")
  }
  else {
    leavePage("./schedule")
  }
}

const mobileCheck = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

const SCREEN_PARA = 2.5
const HAND_PARA = 2
const PHONE_PARA = 5
const IS_MOBILE = mobileCheck()
if (IS_MOBILE) {
  $(document).ready(() => {
    $("#photo-verification-hand-2")[0].style.transform = "translateY(-400px)"
  })
}
$(window).scroll(() => {
  const scroll = $(window).scrollTop()
  try {
    if (!IS_MOBILE) {
      $("#schedule-phone").css("transform", ("translateY(" + (Math.max(Math.min((((scroll + 100 + 360) - 600) / (PHONE_PARA)) - 60, 200), -120) * (-1)).toString() + "px)"))
      $("#paid-phone").css("transform", ("translateY(" + (Math.max(Math.min((((scroll + 100 + 360 + 150) - 1950) / (PHONE_PARA)) - 120, 200), -120) * (-1)).toString() + "px)"))
      $("#photo-verification-hand-2").css("transform", "translateY(-" + Math.max(Math.min((150 + (((scroll + 100 + 360 + 150) - 1500) / HAND_PARA)), 300), 0).toString() + "px)")
      $("#photo-verification-hand-1").css("transform", "translateY(" + Math.max(Math.min((0 + (((scroll + 100 + 360 + 150) - 1500) / (HAND_PARA * 2))), 100), 0).toString() + "px)")
    }
  }
  catch (e) {
    console.log(e)
  }
})

const fetchEarnings = () => {
  $.ajax({
    url: (API + "/earnings"),
    type: "GET",
    success: (data) => {
      RETURNS = ((data.lastMonth * 100) || ESTIMATED_RETURN)
      try {
        slider($("#slider")[0])
      } catch (e) {}
    }
  })
}


const MATRIX_SIZE = 10000
const MATRIX_FLIP_CHANCE = 0.02
const MATRIX_LAG = 70

let matrixNums = []
const initMatrix = () => {
  for (let i = 0; i < MATRIX_SIZE; i++) {
    matrixNums.push(Math.round(Math.random()))
  }
}

const setMatrix = () => {
  let s = ""
  for (let n of matrixNums) {
    s += n.toString()
  }
  $("#matrix")[0].innerHTML = s
}

initMatrix()
fetchEarnings()
