const YEAR = (new Date()).getFullYear()

const API = "https://0zynwo3qw4.execute-api.us-east-1.amazonaws.com/dev"
const ESTIMATED_RETURN = 10
const SLIDER_INIT_MIN = 30
const SLIDER_INIT_MAX = 80
const SLIDER_DURATION_MS = 1200
const TIME_ZONE = "America/Los_Angeles"
const EPOCH = [1970, 0, 1]
const LOCAL_STORAGE_TAG = "__paywake-"

const IS_IOS = (
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream
)

const REDIRECTS = {
  home: "./",
  onAuth: "./dashboard",
  noAuth: "./login"
}

if (JSON.parse(localStorage.getItem("__paywake-dev"))) {
  const add = ("?" + (new URL(window.location.href)).searchParams.toString())
  for (let key in REDIRECTS) {
    REDIRECTS[key] = (REDIRECTS[key] + add)
  }
}

const cleanPhone = (string) => {
  return string.toString().trim().toLowerCase().replace(/[^0-9]+/g, "")
}

const cleanName = (string) => {
  return string.toString().trim().replace(/[^a-zA-Z\.\- ]+/g, "")
}

const formatPhone = (value) => {
  if (!value) {
    return value
  }
  const number = value.replace(/[^\d]/g, "")
  const n = number.length
  if (n < 4) {
    return number
  }
  if (n < 7) {
    return `(${number.slice(0, 3)}) ${number.slice(3)}`
  }
  return `(${number.slice(0, 3)}) ${number.slice(3,6)}-${number.slice(6, 10)}`
}

const phoneFormatter = (obj) => {
  const value = formatPhone(obj.value)
  obj.value = value
}

const leavePage = (page = "./dashboard", params = []) => {
  let devAdd = ""
  let paramsAdd = ""
  let qFlag = true
  if (devAdd.length) {
    qFlag = false
  }
  for (let param of params) {
    let c = "&"
    if (qFlag) {
      c = "?"
      qFlag = false
    }
    paramsAdd = (paramsAdd + c + encodeURIComponent(param[0]) + "=" + encodeURIComponent(param[1]))
  }
  window.location.href = (page + devAdd + paramsAdd)
}

$(window).on("load", () => {
  if (IS_IOS) {
    $(".if-ios").removeClass("if-ios")
  }
});

(() => {
  const SAFARI_FIX = {
    minInnerHeight: window.innerHeight,
    maxInnerHeight: false,
    passiveIfSupported: false
  };
  try {
    window.addEventListener("test", null, Object.defineProperty({}, "passive", {
      get: () => {
        SAFARI_FIX.passiveIfSupported = {
          passive: true
        }
      }
    }))
  } catch (err) {};
  document.addEventListener("scroll", (e) => {
    const windowInnerHeight = window.innerHeight;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      if (!SAFARI_FIX.minInnerHeight || (windowInnerHeight < SAFARI_FIX.minInnerHeight)) {
        SAFARI_FIX.minInnerHeight = windowInnerHeight
      }
      if ((!SAFARI_FIX.maxInnerHeight || (windowInnerHeight > SAFARI_FIX.maxInnerHeight)) && windowInnerHeight > SAFARI_FIX.minInnerHeight) {
        SAFARI_FIX.maxInnerHeight = windowInnerHeight
      }
      if (SAFARI_FIX.maxInnerHeight && (SAFARI_FIX.maxInnerHeight == windowInnerHeight)) {
        $(document.body).addClass("safari-toolbars-hidden")
      } else {
        $(document.body).removeClass("safari-toolbars-hidden")
      }
    }
  }, SAFARI_FIX.passiveIfSupported);
})();

const __EMOJIS = {};
(() => {
  const setEmojiDate = (month, day, emoji) => {
    if (!__EMOJIS[month]) {
      __EMOJIS[month] = {}
    }
    __EMOJIS[month][day.toString()] = emoji
  }

  //EMOJI HOLIDAYS
  setEmojiDate("FEB", 14, "💕")
  setEmojiDate("MAR", 17, "☘️")
  setEmojiDate("JUL",  4, "🇺🇸")
  setEmojiDate("OCT", 31, "🎃")
  setEmojiDate("DEC", 25, "🎄")

})();
(() => {
  let day = moment().format("DD").toString().trim()
  let month = moment().format("MMM").toUpperCase().trim()
  let emoji = ""
  try {
    emoji = __EMOJIS[month][day]
  } catch (e) {
    emoji = ""
  }
  if (emoji !== undefined && emoji.length) {
    $(window).on("load", () => {
      document.getElementsByClassName("logo")[0].childNodes[3].innerHTML = (document.getElementsByClassName("logo")[0].childNodes[3].innerHTML + (" " + emoji))
    })
  }
})();
