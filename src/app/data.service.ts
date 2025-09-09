import { Injectable, inject } from "@angular/core";
import { Firestore, getDocs, doc, updateDoc, onSnapshot } from "@angular/fire/firestore";
import { addDoc, collection } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import { SharedService } from "./shared.service";
@Injectable({
    providedIn: 'root',
})
export class DataService {
    firestore = inject(Firestore);
    data: any;
    customerID: string = '';
    companyID: string = '';
    private customersSubject = new BehaviorSubject<any>(null)
    public customersSubject$ = this.customersSubject.asObservable();
    private contactSubject = new BehaviorSubject<any>(null);
    public contactSubject$ = this.contactSubject.asObservable();

    customers: any[] = [

        { name: "Müller GmbH", street: "Hauptstraße 12", city: "Berlin", areacode: "10115", phone: "030 1234567", email: "kontakt@mueller-gmbh.de", status: "", branch: "Bau" },
        { name: "Schneider & Co", street: "Marktplatz 3", city: "München", areacode: "80331", phone: "089 9876543", email: "info@schneiderco.de", status: "", branch: "Handel" },
        { name: "Weber Logistik", street: "Industriestraße 45", city: "Hamburg", areacode: "20095", phone: "040 2345678", email: "service@weber-logistik.de", status: "", branch: "Logistik" },
        { name: "Klein Design", street: "Bahnhofstraße 9", city: "Köln", areacode: "50667", phone: "0221 4567890", email: "hello@kleindesign.de", status: "", branch: "Design" },
        { name: "Autohaus Schmidt", street: "Autoweg 7", city: "Stuttgart", areacode: "70173", phone: "0711 3214567", email: "verkauf@auto-schmidt.de", status: "", branch: "Automobil" },
        { name: "IT Solutions Braun", street: "Technologiepark 22", city: "Dortmund", areacode: "44137", phone: "0231 7896541", email: "support@braun-it.de", status: "", branch: "IT" },
        { name: "Naturkost Huber", street: "Obstweg 5", city: "Freiburg", areacode: "79098", phone: "0761 654321", email: "info@naturkost-huber.de", status: "", branch: "Einzelhandel" },
        { name: "Architekturbüro Weiß", street: "Planstraße 10", city: "Leipzig", areacode: "04109", phone: "0341 876543", email: "kontakt@weiss-architektur.de", status: "", branch: "Architektur" },
        { name: "Elektro König", street: "Kabelstraße 12", city: "Hannover", areacode: "30159", phone: "0511 345678", email: "anfrage@elektro-koenig.de", status: "", branch: "Elektrotechnik" },
        { name: "Meyer Gartenbau", street: "Blumenweg 8", city: "Bremen", areacode: "28195", phone: "0421 567890", email: "info@meyer-gartenbau.de", status: "", branch: "Gartenbau" },
        { name: "Bäckerei Jung", street: "Backgasse 2", city: "Nürnberg", areacode: "90402", phone: "0911 456789", email: "jung@baeckerei.de", status: "", branch: "Lebensmittel" },
        { name: "Schuhhaus Fischer", street: "Modeweg 13", city: "Augsburg", areacode: "86150", phone: "0821 112233", email: "info@schuh-fischer.de", status: "", branch: "Einzelhandel" },
        { name: "Pflegedienst Lichtblick", street: "Sorgstraße 25", city: "Dresden", areacode: "01067", phone: "0351 334455", email: "kontakt@lichtblick-pflege.de", status: "", branch: "Pflege" },
        { name: "Tischlerei Baum", street: "Holzweg 7", city: "Kassel", areacode: "34117", phone: "0561 789123", email: "baum@tischlerei.de", status: "", branch: "Handwerk" },
        { name: "Modehaus Glanz", street: "Modering 9", city: "Heidelberg", areacode: "69117", phone: "06221 987654", email: "service@glanz-mode.de", status: "", branch: "Einzelhandel" },
        { name: "Fitness Loft", street: "Sportstraße 10", city: "Regensburg", areacode: "93047", phone: "0941 112233", email: "info@fitnessloft.de", status: "", branch: "Fitness" },
        { name: "Reisebüro Fernweh", street: "Reisepassage 4", city: "Würzburg", areacode: "97070", phone: "0931 443322", email: "buchung@fernweh.de", status: "", branch: "Tourismus" },
        { name: "AutoCenter Nord", street: "Motorstraße 19", city: "Kiel", areacode: "24103", phone: "0431 998877", email: "kontakt@autocenter-nord.de", status: "", branch: "Automobil" },
        { name: "Malerbetrieb Farbenfroh", street: "Farbenstraße 11", city: "Mainz", areacode: "55116", phone: "06131 334455", email: "info@farbenfroh.de", status: "", branch: "Handwerk" },
        { name: "Softwareagentur CodeCraft", street: "Entwicklerweg 6", city: "Jena", areacode: "07743", phone: "03641 778899", email: "team@codecraft.de", status: "", branch: "IT" },
        { name: "Zahnarztpraxis Lächeln", street: "Zahnstraße 2", city: "Mannheim", areacode: "68159", phone: "0621 112244", email: "praxis@laecheln.de", status: "", branch: "Gesundheit" },
        { name: "Bio-Markt Grünzeug", street: "Frischeweg 17", city: "Erfurt", areacode: "99084", phone: "0361 556677", email: "kontakt@gruenzeug.de", status: "", branch: "Einzelhandel" },
        { name: "Ingenieurbüro PlanWerk", street: "Ingenieurstraße 3", city: "Rostock", areacode: "18055", phone: "0381 112299", email: "plan@planwerk.de", status: "", branch: "Ingenieurwesen" },
        { name: "Lernzentrum Clever", street: "Schulstraße 8", city: "Potsdam", areacode: "14467", phone: "0331 998844", email: "info@clever-lernen.de", status: "", branch: "Bildung" },
        { name: "Eventagentur Highlight", street: "Showweg 5", city: "Osnabrück", areacode: "49074", phone: "0541 334466", email: "events@highlight.de", status: "", branch: "Event" },
        { name: "Steuerkanzlei Klar", street: "Finanzgasse 14", city: "Magdeburg", areacode: "39104", phone: "0391 223344", email: "kanzlei@klar-steuer.de", status: "", branch: "Finanzen" },
        { name: "Werbetechnik Pixel", street: "Designallee 6", city: "Oldenburg", areacode: "26122", phone: "0441 778899", email: "service@pixel-werbung.de", status: "", branch: "Werbung" },
        { name: "Getränke Quelle", street: "Durststraße 23", city: "Lübeck", areacode: "23552", phone: "0451 223344", email: "info@getraenke-quelle.de", status: "", branch: "Großhandel" },
        { name: "Haus & Hof", street: "Immobilienweg 1", city: "Ulm", areacode: "89073", phone: "0731 998877", email: "kontakt@hausundhof.de", status: "", branch: "Immobilien" },
        { name: "Medizintechnik VITAL", street: "Gesundheitsstraße 9", city: "Saarbrücken", areacode: "66111", phone: "0681 778899", email: "service@vital-tech.de", status: "", branch: "Gesundheit" },
        { name: "Transport Express", street: "Schnellweg 7", city: "Bochum", areacode: "44787", phone: "0234 112233", email: "anfrage@transport-express.de", status: "", branch: "Logistik" },
        { name: "Kunstgalerie Vision", street: "Galerieplatz 5", city: "Wiesbaden", areacode: "65183", phone: "0611 334455", email: "galerie@vision-art.de", status: "", branch: "Kunst" },
        { name: "Schreibwaren Krug", street: "Papierweg 3", city: "Trier", areacode: "54290", phone: "0651 556677", email: "info@krug-schreibwaren.de", status: "", branch: "Einzelhandel" },
        { name: "Haustechnik Profi", street: "Technikerstraße 12", city: "Reutlingen", areacode: "72760", phone: "07121 445566", email: "kontakt@haustech-profi.de", status: "", branch: "Handwerk" },
        { name: "Licht & Ton", street: "Eventstraße 4", city: "Hagen", areacode: "58095", phone: "02331 112244", email: "service@lichtundton.de", status: "", branch: "Eventtechnik" },
        { name: "Baumarkt Hammer", street: "Werkzeugstraße 15", city: "Siegen", areacode: "57072", phone: "0271 998877", email: "info@baumarkt-hammer.de", status: "", branch: "Baumarkt" },
        { name: "Kurierdienst Schnell", street: "Paketstraße 20", city: "Flensburg", areacode: "24937", phone: "0461 556677", email: "express@schnell-kurier.de", status: "", branch: "Logistik" },
        { name: "Fotostudio Blickfang", street: "Linsenweg 9", city: "Cottbus", areacode: "03046", phone: "0355 223344", email: "studio@blickfang.de", status: "", branch: "Fotografie" },
        { name: "Floristik Blüte", street: "Blumenstraße 7", city: "Passau", areacode: "94032", phone: "0851 667788", email: "kontakt@bluete.de", status: "", branch: "Floristik" },
        { name: "Reinigungsservice Klarblick", street: "Sauberweg 2", city: "Koblenz", areacode: "56068", phone: "0261 778899", email: "info@klarblick.de", status: "", branch: "Dienstleistung" },
        { name: "Bauunternehmen Stark", street: "Bauhofstraße 11", city: "Göttingen", areacode: "37073", phone: "0551 334455", email: "kontakt@stark-bau.de", status: "", branch: "Bau" },
        { name: "Digitaldruck Schmidt", street: "Druckstraße 3", city: "Paderborn", areacode: "33098", phone: "05251 889900", email: "druck@schmidt-digital.de", status: "", branch: "Druck" },
        { name: "Tierklinik Gesund", street: "Tierweg 8", city: "Gera", areacode: "07545", phone: "0365 998877", email: "kontakt@tierklinik-gesund.de", status: "", branch: "Gesundheit" },
        { name: "Café Morgenrot", street: "Kaffeeallee 5", city: "Dessau", areacode: "06844", phone: "0340 334455", email: "info@morgenrot-cafe.de", status: "", branch: "Gastronomie" },
        { name: "Rechtsanwalt Stark", street: "Justizstraße 6", city: "Zwickau", areacode: "08056", phone: "0375 112233", email: "kanzlei@anwalt-stark.de", status: "", branch: "Recht" },
        { name: "Optiker Brillensicht", street: "Augenstraße 10", city: "Ravensburg", areacode: "88212", phone: "0751 667788", email: "info@brillensicht.de", status: "", branch: "Einzelhandel" }
    ];









    constructor() {

    }


    ngOnInit() {

    }
    // setCompanyID(id: string | null = null) {
    //     if (id) {
    //         this.companyID = id;
    //         console.log('companyID geladen', this.companyID);
    //     } else {
    //         this.getDataFromLocalStorage('companyID');
    //         this.companyID = this.data;
    //         console.log('companyID aus localStorage geladen', this.companyID);
    //     }
    // }


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


    async getDataFromFirestore(dataCollection: string, id: string) {
        console.log(dataCollection);

        try {
            const usersCollection = collection(this.firestore, `companies/${id}/${dataCollection}`);
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


    async loadCustomers(companyID: string) {
        const collectionRef = collection(this.firestore, `companies/${companyID}/customers/`)
        onSnapshot(collectionRef, (snapshot) => {
            const customers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            this.customersSubject.next(customers);

        })


    }

    async updateCustomer(companyID: string, customerID: string, data: any) {
        const docRef = doc(this.firestore, `companies/${companyID}/customers/${customerID}`);
        console.log(docRef);
        console.log(data);
        await updateDoc(docRef, data);

    }
    async addContact(companyID: string, customerID: string, data: any) {
        console.log(companyID);
        console.log(customerID)
        console.log(data);
        const collectionRef = collection(this.firestore, `companies/${companyID}/customers/${customerID}/contacts`);
        await addDoc(collectionRef, data);

    }


    async loadContacts(companyID: string, customerID: string,) {
        const collectionRef = collection(this.firestore, `companies/${companyID}/customers/${customerID}/contacts`);
        onSnapshot(collectionRef, (snapshot) => {
            const contacts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            this.contactSubject.next(contacts);

        })
    }


    async updateContact(companyID: string, customerID: string, contactID: string, data: any) {
        const docRef = doc(this.firestore, `companies/${companyID}/customers/${customerID}/contacts/${contactID}`);
        await updateDoc(docRef, data);
    }

    async addCustomer(companyID: string, customerData: any) {
        const docRef = collection(this.firestore, `companies/${companyID}/customers/`)
        await addDoc(docRef, customerData)
        console.log('Kunde wurde in der Datenbank gespeichert', customerData);

    }


    // async addCostumer(companyID: string) {
    //     console.log(companyID);
    //     const collectionRef = collection(this.firestore, `companies/${companyID}/customers/`);
    //     console.log(this.customers);

    //     for (let index = 0; index < this.customers.length; index++) {
    //         const cust = this.customers[index];
    //         console.log(cust);

    //         await addDoc(collectionRef, cust)
    //     }

    // }
}