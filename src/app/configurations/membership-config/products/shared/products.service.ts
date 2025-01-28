import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateProducts(productsModel:any){
    return this.commonHttpService.put(productsModel, Headers, Configuration.MEMBERSHIP + Configuration.SUB_PRODUCTS + Configuration.UPDATE);
  }

  addProducts(productsModel:any){
    return this.commonHttpService.post(productsModel, Headers, Configuration.MEMBERSHIP + Configuration.SUB_PRODUCTS+ Configuration.ADD);
  }

  getAllProducts(){
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.SUB_PRODUCTS + Configuration.GET_ALL);
  }

  getProductsById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, Configuration.MEMBERSHIP + Configuration.SUB_PRODUCTS + Configuration.GET);
  }

  deleteProducts(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, Configuration.MEMBERSHIP + Configuration.SUB_PRODUCTS + Configuration.DELETE);
  }
}
