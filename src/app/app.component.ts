import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './model/product.model';
import { ProductService } from './services/product.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'httpRequest';
  state = ['Active', 'Inactive'];

  prod!: Product;

  Allproducts: Product[] = [];
  isFetching: boolean = false;
  editMode: boolean  = false;
  currentProductId!: string;
  submitted: boolean = false;
  showMe: boolean = false;
  rowClicked: any;

  @ViewChild('product') form!: NgForm;

  //Injecting productService
  constructor(private productService: ProductService){}

  //Fetch all products on app load
  ngOnInit(): void {
      this.getProducts();

      //Method to subscribe to the emitted data from product service
      this.productService.onShowDetailsClicked.subscribe((data) => {
        this.prod = data;
      })
  }

  //Method to post the products into the database
  onProductAdd(products: Product) {
    if(!this.editMode){

      this.productService.addProduct(products).subscribe((response) => {return response});
      this.form.resetForm();
      
      this.submitted = true;

      setTimeout(() => {
        this.submitted = false;
      }, 8000);

    } else {
      this.productService.updateProduct(this.currentProductId, products).subscribe();
      
      this.form.resetForm();
      this.editMode = false;
    }
    
  }

  //Method to fetch the products from database
  private getProducts(){
    this.isFetching = true;
    this.productService.fetchProducts().subscribe((products) => {
      this.Allproducts = products;
      this.isFetching = false;
    })
  }

  //Method to fetch all products
  fetchProducts(){
    this.getProducts();
  }

  //Method to delete product from database
  onDeleteProduct(id: string) {
    this.productService.deleteProduct(id)
    .subscribe(() => (this.Allproducts = this.Allproducts
      .filter((prod) => prod.id !== id)));

    this.showMe = false;
  }

  // On edit button click
  onEditClick(id: string) {
    this.currentProductId = id;
    // get the product based on the id
    let currentProduct = this.Allproducts.find((currentElement) => {return currentElement.id === id});
    // console.log(currentProduct);
    // populate the form with the product details
    this.form.setValue({
      prodname: currentProduct?.prodname,
      prodtype: currentProduct?.prodtype,
      model: currentProduct?.model,
      serial: currentProduct?.serial,
      status: currentProduct?.status
    });

    // Change the button value to edit 
    this.editMode = true;

    //hide the details view
    this.showMe = false;

    //Remove background from the row
    this.rowClicked = false;
  }

  //Method to showDetails once the row is clicked
  showDetails(prod: Product){
    //Condition to add background to clicked row
    if (this.showMe) this.rowClicked = !this.rowClicked;
    else this.rowClicked = prod;
    
    //Toggle details view
    this.showMe = !this.showMe;

    //Show the details
    this.productService.showProdDetails(prod);
  }

  //Close details view
  onClose() {
    //hide the details view
    this.showMe = false;

    //Remove background from the row
    this.rowClicked = false;
  }
}
