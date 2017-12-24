import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, PixelRatio, Image } from "react-native";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import Icon from "react-native-vector-icons/FontAwesome";
import AccountKit, { LoginButton, Color, StatusBarStyle } from "react-native-facebook-account-kit";
var DeviceInfo = require("react-native-device-info");
import Svg, { Circle, Rect } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import LocalizedStrings from "react-native-localization";
import ImagePicker from "react-native-image-picker";

let strings = new LocalizedStrings({
  en: {
    how: "How do you want your egg today 123?",
    boiledEgg: "Boiled egg",
    softBoiledEgg: "Soft-boiled egg",
    choice: "How to choose the egg"
  },
  vi: {
    how: "Day la tieng viet ?",
    boiledEgg: "Uovo sodo",
    softBoiledEgg: "Uovo alla coque",
    choice: "Come scegliere l'uovo"
  }
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fbData: "",
      authToken: null,
      loggedAccount: null,
      restartAllowed: true,
      avatarSource: null,
      videoSource: null
    };
  }
  componentWillMount() {
    AccountKit.getCurrentAccessToken()
      .then(token => {
        if (token) {
          AccountKit.getCurrentAccount().then(account => {
            this.setState({
              authToken: token,
              loggedAccount: account
            });
          });
        } else {
          console.log("No user account logged");
        }
      })
      .catch(e => console.log("Failed to get current access token", e));
  }

  loginFB = () => {
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
      result => {
        if (result.isCancelled === true) {
          // console.log(isCancelled)
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            if (data) {
              const { accessToken } = data;
              const responseInfoCallback = (error, dataFB) => {
                console.log(dataFB);
                this.setState({
                  fbData: `${dataFB.name} - ${dataFB.birthday} - ${dataFB.email}`
                });
              };
              const infoRequest = new GraphRequest(
                "/me",
                {
                  accessToken,
                  parameters: {
                    fields: {
                      string:
                        "email,name, first_name, middle_name, last_name, birthday, picture.width(150).height(150)"
                    }
                  }
                },
                responseInfoCallback
              );
              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          });
        }
      },
      error => {
        // error
        console.log(error);
      }
    );
  };

  onLogin(token) {
    if (!token) {
      console.warn("User canceled login");
      this.setState({});
    } else {
      AccountKit.getCurrentAccount().then(account => {
        this.setState({
          authToken: token,
          loggedAccount: account
        });
      });
    }
  }

  onLoginError = e => {
    console.log("Failed to login", e);
  };

  onLogoutPressed() {
    AccountKit.logout()
      .then(() => {
        this.setState({
          authToken: null,
          loggedAccount: null
        });
      })
      .catch(e => console.log("Failed to logout"));
  }

  renderUserLogged() {
    const { id, email, phoneNumber } = this.state.loggedAccount;
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={() => this.onLogoutPressed()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Account Kit Id</Text>
        <Text style={styles.text}>{id}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>{email}</Text>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.text}>
          {phoneNumber ? `${phoneNumber.countryCode} ${phoneNumber.number}` : ""}
        </Text>
      </View>
    );
  }

  renderLogin() {
    return (
      <View>
        <LoginButton
          style={styles.button}
          type="phone"
          onLogin={token => this.onLogin(token)}
          onError={e => this.onLogin(e)}
        >
          <Text style={styles.buttonText}>SMS</Text>
        </LoginButton>
      </View>
    );
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  nextScreen() {
    this.props.navigator.push({
      screen: "RNBoot.DemoScreen",
      title: "Xin chao",
      animationType: "slide-horizontal"
    });
  }

  render() {
    console.log(this.state);
    AccessToken.getCurrentAccessToken().then(token => {
      console.log(token);
    });
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>{this.state.fbData}</Text>
        <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={() => this.loginFB()}>
          Login Facebook
        </Icon.Button>
        <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.linearGradient}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </LinearGradient>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
            <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20, marginTop: 20 }]}>
              {this.state.avatarSource === null ? (
                <Text>Select a Photo</Text>
              ) : (
                <Image style={styles.avatar} source={this.state.avatarSource} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <Svg height="100" width="100">
          <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
          <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
        </Svg>
        <Text style={styles.title}>{strings.how}</Text>
        <View>{this.state.loggedAccount ? this.renderUserLogged() : this.renderLogin()}</View>
        <Text style={styles.welcome}>{DeviceInfo.getUniqueID()}</Text>
        <Text onPress={() => this.nextScreen()} style={styles.instructions}>
          To get started, edit App.js
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  button: {
    height: 50,
    width: 300,
    backgroundColor: "green",
    marginBottom: 10
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#fff",
    backgroundColor: "transparent"
  },
  label: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  linearGradient: {
    height: 100,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red"
  },
  avatar: {
    borderRadius: 50,
    width: 100,
    height: 100
  },
  linearGradient: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  }
});
