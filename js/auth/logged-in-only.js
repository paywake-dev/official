const AUTH = () => {
  if (!SESSION) {
    window.location.href = REDIRECTS.noAuth
  }
  $(document).ready(() => {
    USER.getUserAttributes((err, result) => {
      if (err && (err.message === "Access Token has been revoked" || err.message === "User is disabled.")) {
        ROUTINES.logout()
      }
      else {
        for (const attribute of result) {
          if (attribute.Name === "profile" && attribute.Value === "true") {
            try {
              MODAL.banned()
            } catch (e) {}
          }
        }
      }
    })
  })
}

(() => {
  let wakeups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAG + "wakeups"))
  if (wakeups) {
    if (wakeups.length) {
      let WAKEUP = false
      const LOCAL_TIME_ZONE = moment.tz.guess()
      const TODAY = moment().tz(TIME_ZONE).diff(moment.tz(EPOCH, TIME_ZONE).hour(0).minute(0).second(0), "days")
      for (let w of wakeups) {
        if (w.day === TODAY) {
          WAKEUP = w
        }
      }
      if (WAKEUP) {
        if (!WAKEUP.verified) {
          const time = moment.tz(EPOCH, TIME_ZONE).add(WAKEUP.day, "days").add(Math.floor(WAKEUP.time / 60), "hours").add(WAKEUP.time % 60, "minutes").add(3, "minutes").tz(LOCAL_TIME_ZONE)
          const diff = Math.floor(time.diff(moment()) / 1000)
          if (!window.location.href.toString().includes("verify")) {
            if (!MODAL.isBanned) {
              if (!(new URLSearchParams(window.location.search)).get("verified")) {
                if (diff > 0 && diff < ((60 * 3) + 1)) {
                  leavePage("./verify")
                }
                else if (diff > 0 && diff < (60 * (10))) {
                  setTimeout(() => {
                    leavePage("./verify")
                  }, (((diff - (60 * 3)) * (1000)) + 1000))
                }
              }
            }
          }
        }
      }
    }
  }
})()
