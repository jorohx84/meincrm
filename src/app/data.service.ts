import { Injectable, inject } from "@angular/core";
import { Firestore, collection, getDocs, doc, updateDoc } from "@angular/fire/firestore";
@Injectable({
    providedIn: 'root',
})
export class DataService {
    firestore = inject(Firestore);
    data: any;
    companyID: string | null = null;

    setCompanyID(id: string | null = null) {
        if (id) {
            this.companyID = id;
            console.log('companyID geladen', this.companyID);
        }else{
            this.getDataFromLocalStorage('companyID');
            this.companyID=this.data;
            console.log('companyID aus localStorage geladen', this.companyID);
        }
    }


    getDataFromLocalStorage(data: any) {
        const storedData = localStorage.getItem(data);
        if (storedData) {
            try {
                this.data = JSON.parse(storedData);
                console.log('Daten aus localStorage wiederhergestellt (als JSON):', this.data);
            } catch (e) {
                this.data = storedData;
                console.log('Daten aus localStorage wiederhergestellt (als String):', this.data);
            }
        } else {
            console.log('Keine Daten im localStorage gefunden');
        }
    }

    saveDataToLocalStorage(local: string, data: any) {

        if (typeof data === 'string') {
          
            localStorage.setItem(local, data);
        } else {
          
            localStorage.setItem(local, JSON.stringify(data));
        }
    }


    async getDataFromFirestore(dataCollection: string) {
        console.log(dataCollection);
        
        try {
            const usersCollection = collection(this.firestore, `companies/${this.companyID}/${dataCollection}`);
            const userSnapshot = await getDocs(usersCollection);
            return userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    }
}