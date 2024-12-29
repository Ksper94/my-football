const jwt = require('jsonwebtoken');

// Token et clé secrète
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwM2M4MjJmNC1mMTU1LTRiYjgtYmZhOC1iZjM2ZWYxODVmZDUiLCJpYXQiOjE3MzU0ODI1NzcsImV4cCI6MTczODA3NDU3N30.cvRXveowb07l_ViKq9RLT1Q9RkBteu4Vw6cN5cXTtIg";
const secret = "Q/X62wPT1Co1l7XWpWjRqZxF0bsg8vbBFrdAUk3u/DU=";

try {
    const decoded = jwt.verify(token, secret);
    console.log('Token valide :', decoded);
} catch (err) {
    console.error('Erreur de vérification du token :', err.message);
}
