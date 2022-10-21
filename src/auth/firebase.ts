import * as admin from 'firebase-admin'
import { ServiceAccount } from 'firebase-admin';

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
} as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(sa)
});


export async function getFirebaseUser(context: any) {
  console.log('INSIDE getFirebaseUser() ')
  const authHeader = context.req.headers.authorization;
  console.log(`getFirebaseUser ====>>> ${authHeader}`)
  if(!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s/, "");
  if(!token) return null;
  try {
    const payload = await admin.auth().verifyIdToken(token);
    console.log(`Decoded Id token : ${JSON.stringify(payload)}`);
    return payload;
  } catch(err) {
    console.log('Invalid token');
  }
  return null;
}