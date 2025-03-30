export class User {
    name: string;
    email: string;
    password:string;
    companyID:string;
    messages: any[];
    tasks: any[];
    logindate: string;
    role: string;

    constructor(user?: any) {
        this.name = user ? user.name : '';
        this.email = user ? user.email : '';
        this.companyID = user ? user.companyID : '';
        this.password = user ? user.password : '';
        this.messages = user ? user.messages : [];
        this.tasks = user ? user.tasks : [];
        this.logindate = user ? user.logindate : '';
        this.role = user ? user.role : '';
    }
}

