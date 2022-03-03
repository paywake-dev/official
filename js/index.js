sliderInit(document.getElementsByClassName("slider")[0])

if (USER) {
  $("#my-account")[0].innerHTML = "My Account"
}

if (localStorage.getItem(LOCAL_STORAGE_TAG + "has-account")) {
  $("#my-account-link")[0].href = "./login"
}
