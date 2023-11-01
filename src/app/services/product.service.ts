import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { map } from "rxjs";
import { Product } from "../model/product.model";

@Injectable({providedIn: "root"})
export class ProductService {

    private apiUrl = "https://ekich-6b764-default-rtdb.firebaseio.com/products";

    onShowDetailsClicked = new EventEmitter<Product>();

    constructor(private http: HttpClient){}

    //Method to add product in database
    addProduct(products: Product) {
        const header = new HttpHeaders({'myHeader': 'eKICH'})
        return this.http.post<{name: string}>(`${this.apiUrl}.json`, products, {headers: header});
    }

    //Method to fetch products from database
    fetchProducts() {
        return this.http.get<{[key: string]: Product}>(`${this.apiUrl}.json`)
        .pipe(map((res) => {
        const products = [];
        for(const key in res){
            if(res.hasOwnProperty(key)){
            products.push({...res[key as keyof typeof res], id: key})
            }
        }
        return products;
        }))
    }
 
    //Method to delete products from database
    deleteProduct(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}.json`);
    }

    //Method to update the product in the database
    updateProduct(id: string, value: Product) {
        return this.http.put(`${this.apiUrl}/${id}.json`, value);
    }

    showProdDetails(prod: Product){
        this.onShowDetailsClicked.emit(prod);
    }
}