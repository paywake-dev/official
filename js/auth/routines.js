const ROUTINES = {

  //LOGIN
  login: (phone, password, token, callback = (() => {})) => {
    const AUTH_DETAILS = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: phone,
      Password: password,
      ValidationData: [token],
    })
    USER = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: phone,
      Pool: USER_POOL
    })
    USER.authenticateUser(AUTH_DETAILS, {
      onSuccess: (result) => {
        USER = result.user
        callback(null)
      },
      onFailure: (err) => {
        callback(err)
      },
    })
  },

  //SIGNUP
  signup: (name, phone, password, token, callback = (() => {})) => {
    let attributes = new Array()
    const PHONE = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      Name: "phone_number",
      Value: phone
    })
    const NAME = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      Name: "name",
      Value: name.toString().trim()
    })
    attributes.push(PHONE)
    attributes.push(NAME)

    USER_POOL.signUp(phone, password, attributes, [{
      Name: "recaptchaToken",
      Value: token,
    }], (err, result) => {
      if (err) {
        callback(err)
      }
      else {
        USER = result.user
        localStorage.setItem("__paywake-verify", phone)
        localStorage.setItem("__paywake-temp-name", name)
        localStorage.setItem("__paywake-temp-username", phone)
        localStorage.setItem("__paywake-temp-password", password)
        callback(null)
      }
    })
  },

  //VERIFY
  verify: (code, callback = (() => {})) => {
    USER = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
        Username: localStorage.getItem("__paywake-verify").toString(),
        Pool: USER_POOL
    })
    USER.confirmRegistration(code, true, (err, result) => {
      if (err) {
        callback(err)
      }
      else {
        callback(null)
      }
    })
  },

  //LOGOUT
  logout: () => {
    const redirect = () => {
      const anticlears = {}
      for (let anticlear of ANTI_CLEARS) {
        if (localStorage.getItem(LOCAL_STORAGE_TAG + anticlear) !== null) {
          anticlears[anticlear] = localStorage.getItem(LOCAL_STORAGE_TAG + anticlear)
        }
      }
      localStorage.clear()
      for (let anticlear in anticlears) {
        localStorage.setItem(LOCAL_STORAGE_TAG + anticlear, anticlears[anticlear])
      }
      window.location.href = REDIRECTS.home
    }
    if (USER != null) {
      USER.getSession((err, session) => {
        USER.globalSignOut({
          onSuccess: (data) => {
            redirect()
          },
          onFailure: (err) => {
            redirect()
          }
        })
      })
    }
    else {
      localStorage.clear()
      window.location.href = REDIRECTS.home
    }
  },

  //RESEND VERIFICATION
  resend: (callback = (() => {})) => {
    (new AWS.CognitoIdentityServiceProvider()).resendConfirmationCode({
      ClientId: USER_POOL.clientId,
      Username: localStorage.getItem("__paywake-verify").toString()
    }, (err, result) => {
      if (err) {
        callback(err)
      }
      else {
        callback(null)
      }
    })
  },

  //FORGOT PASSWORD
  forgot: (phone, callback = (() => {})) => {
    USER = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: phone,
      Pool: USER_POOL
    })
    USER.forgotPassword({
      onSuccess: (result) => {
        callback(null)
      },
      onFailure: (err) => {
        callback(err)
      },
    })
  },

  //UPDATE PASSWORD
  update: (phone, code, password, callback = (() => {})) => {
    USER = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: phone,
      Pool: USER_POOL
    })
    USER.confirmPassword(code, password, {
      onSuccess: (result) => {
        callback(null)
      },
      onFailure: (err) => {
        callback(err)
      },
    })
  },

  //SET NAME
  name: (name, callback = (() => {})) => {
    name.toString().trim()
    if (name.length) {
      USER.updateAttributes([new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "name",
        Value: name,
      })], (err, result) => {
        if (err) {
          callback(err)
        }
        else {
          localStorage.setItem(LOCAL_STORAGE_TAG + "name", name)
          callback(null)
        }
      })
    }
  },

  //DELETE ACCOUNT
  delete: (callback = (() => {})) => {
    USER.deleteUser((err, result) => {
      if (err) {
        callback(err)
      }
      else {
        callback(null)
      }
    })
  },

}
