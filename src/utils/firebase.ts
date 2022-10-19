import * as admin from 'firebase-admin'
import { App, initializeApp } from 'firebase-admin/app'
import * as fireorm from 'fireorm'
import * as serviceAccount from '../../config/beminor-742a2-41ee157bbaeb.json'

let firebaseApp: App = null
export function getFirebaseApp() {
  return firebaseApp
}

export async function initFirebase() {
  if (!firebaseApp) {
    // console.log('ser:', serviceAccount)
    firebaseApp = initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    })
    const firestore = admin.firestore()
    firestore.settings({ timestampsInSnapshots: true })
    fireorm.initialize(firestore)
  }
}
