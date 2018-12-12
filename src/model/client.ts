export class Client {
    public name: string;
    public address: string;
    public email: string;
    public icon: string;
    public is_active: boolean;
    public mobile: string;
    public phone: string;
    public user_type: string;
    public company: any;
    public invoice: any;
}

/*
"address" : "123 Test Ave Test Suburb 1234 Test State Test Country",
"company" : {
  "id" : 1,
  "name" : "Test1"
},
"email" : "test@test.com",
"icon" : "",
"id" : 1,
"invoice" : [ {
  "company_name" : "Test",
  "id" : 1
} ],
"is_active" : 1,
"mobile" : "0412345678",
"name" : "Test1",
"phone" : "012345678",
"user_type" : "admin"
*/
