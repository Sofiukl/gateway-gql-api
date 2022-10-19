const axios = require('axios').default;
const admin = require('firebase-admin');
require("dotenv").config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

const sa = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  client_id: process.env.CLIENT_ID,
  client_email: process.env.CLIENT_EMAIL,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const createToken = async uid => {
  try {
    await admin.auth().setCustomUserClaims(uid, {role: "ADMIN"})
    const customToken = await admin.auth().createCustomToken(uid);
    const res = await axios({
      url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${FIREBASE_API_KEY}`,
      method: 'post',
      data: {
        token: customToken,
        returnSecureToken: true
      },
      json: true,
    });

    return res.data.idToken;

  } catch (e) {
    console.log(e);
  }
}

createToken('YBMJABGBiPWX35btX2lssdBhH1T2').then(
  token => console.log(token)
)