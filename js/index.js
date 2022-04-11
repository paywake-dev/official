sliderInit(document.getElementsByClassName("slider")[0])

if (USER) {
  $("#my-account")[0].innerHTML = "My Account"
}

if (localStorage.getItem(LOCAL_STORAGE_TAG + "has-account")) {
  $("#my-account-link")[0].href = "./login"
}

setMatrix()
const matrixInterval = setInterval(() => {
  for (let i in matrixNums) {
    if (Math.random() < MATRIX_FLIP_CHANCE) {
      matrixNums[i] = Math.abs(matrixNums[i] - 1)
    }
  }
  setMatrix()
}, MATRIX_LAG)
