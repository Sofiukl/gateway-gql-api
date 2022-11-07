# my-todos-gateway-gql
My Todos GraphQL Gateway

# ENV variables
MY_TODOS_REST_SERVICE=REPLACE_WITH_MY_TODOS_REST_SERVICE
MY_TODOS_USER_GQL_SERVICE=REPLACE_WITH_MY_TODOS_USER_GQL_SERVICE

<pre>
If want to use firebase authentication, then uncomment below line 
const user = await getFirebaseUser({req});
and comment below line
const user = getCurrentUser({ req });
</pre>

Firebase service account config required only if firebase auth enabled <br/>
PROJECT_ID=REPLACE_WITH_PROJECT_ID <br/>
PRIVATE_KEY_ID=REPLACE_WITH_PRIVATE_KEY_ID <br/>
PRIVATE_KEY=REPLACE_WITH_PRIVATE_KEY <br/>
CLIENT_EMAIL=REPLACE_WITH_CLIENT_EMAIL <br/>
CLIENT_ID=REPLACE_WITH_CLIENT_ID <br/>
FIREBASE_API_KEY=REPLACE_WITH_FIREBASE_API_KEY <br/>
AUTH_URI=https://accounts.google.com/o/oauth2/auth <br/>
TOKEN_URI=https://oauth2.googleapis.com/token <br/>
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs <br/>
CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4hej6%40my-todos-4f578.iam.gserviceaccount.com <br/>



# Run code in dev mode 
The below scripts we defined in our package.json
<pre>
"schema-type": "graphql-codegen --config codegen.yml",
"lint": "eslint . --ext .ts",
"build": "npm run schema-type && tsc",
"start": "npm run build && node build/server.js"
</pre>
We can use npm run start for running our dev server.

