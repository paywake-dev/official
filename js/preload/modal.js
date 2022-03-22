const MODAL = {
  visible: false,
  isBanned: false,
  show: () => {
    if (!MODAL.visible) {
      MODAL.visible = true
      const backdrop = document.getElementById("__modal-backdrop")
      const container = document.getElementById("__modal-container")
      backdrop.className = "on"
      $(container).addClass("visible")
      setTimeout(() => {
        $(backdrop).addClass("visible")
      }, 50)
    }
  },
  hide: () => {
    if (MODAL.isBanned) {
      try {
        ROUTINES.logout()
      } catch (e) {}
    }
    if (MODAL.visible) {
      MODAL.visible = false
      const backdrop = document.getElementById("__modal-backdrop")
      const container = document.getElementById("__modal-container")
      $(backdrop).removeClass("visible")
      $(container).removeClass("visible")
      setTimeout(() => {
        backdrop.className = ""
      }, 650)
      try {
        $("#__modal-canvas")[0].remove()
      } catch (e) {}
    }
  },
  setContent: (elements = []) => {
    const modal = document.getElementById("__modal")
    modal.innerHTML = ""
    for (let element of elements) {
      modal.appendChild(element)
    }
    if (!document.getElementById("__modal-dismiss")) {
      MODAL.addDismiss()
    }
  },
  setHTML: (html = "") => {
    const modal = document.getElementById("__modal")
    modal.innerHTML = html
    if (!document.getElementById("__modal-dismiss")) {
      MODAL.addDismiss()
    }
  },
  addDismiss: () => {
    const modal = document.getElementById("__modal")
    let group = document.createElement("div")
    group.className = "center"
    let dismiss = document.createElement("button")
    dismiss.className = "transparent"
    dismiss.innerHTML = "Dismiss"
    dismiss.id = "__modal-dismiss"
    dismiss.onclick = () => {
      MODAL.hide()
    }
    group.appendChild(dismiss)
    modal.appendChild(group)
  },
  display: (elements = []) => {
    MODAL.setContent(elements)
    MODAL.show()
  },
  displayHTML: (html = "") => {
    MODAL.setHTML(html)
    MODAL.show()
  },
  banned: () => {
    MODAL.hide()
    MODAL.isBanned = true
    MODAL.displayHTML("<h3>Legal Notice</h3><p style='font-size:14px'>You have been permanently banned from Paywake for <b>fraudulent use of our services.</b><br><br>Fraudulent use includes but is not limited to: the creation and use of multiple/duplicate accounts, using fake phone numbers to create one or more accounts, and using bots or VPNs to circumvent our security and/or verification measures.<br><br>Any attempts to circumvent your permanent ban, such as creating another Paywake account, <b>will be met with swift and immediate legal action from our team.</b><br><br>If you believe and have sufficient evidence that this ban is erroneous, please contact us at <a class='gradient' href='mailto:appeals@paywake.net'>appeals@paywake.net</a>.</p>")
  },
}

$(window).on("load", () => {
  let container = document.createElement("div")
  container.id = "__modal-container"
  let modal = document.createElement("div")
  modal.id = "__modal"
  container.appendChild(modal)
  let backdrop = document.createElement("div")
  backdrop.id = "__modal-backdrop"
  backdrop.onclick = () => {
    MODAL.hide()
  }
  document.body.appendChild(backdrop)
  document.body.appendChild(container)
})
