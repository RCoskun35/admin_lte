import { Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './services/http.service';
import { FormsModule} from '@angular/forms';
import { ModuleType } from './modules/module_type';
import { jwtDecode, JwtPayload } from 'jwt-decode';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
[x: string]: any;
  modules:any[]= [];
  roles:any[] = [];
  selectedOptions: number[] = [];
  selectModules:any[] = []; 
  users:any[] = [];
  selectRoles:any[] = []; 
  @ViewChild('moduleSelect2') moduleSelect2!: ElementRef<HTMLSelectElement>;
  @ViewChild('roleSelect2') roleSelect2!: ElementRef<HTMLSelectElement>;
  enumModules = ModuleType;
  emailOrUserName:string = "admin@admin.com";
  password:string = "1";
  decode: JwtPayload | any;
  userId:number=0;
  roleName:string = "";

  constructor(private http:HttpService) {
  }

  addReport(){
    this.http.post("api/Modules/AddReport",{},(res: any)=>{
      alert("Ekleme işlem başarılı");
    },(error: any)=>{
      if(error.status==401){
        alert("Eklemeye Yetkiniz yok");
      }
    });
  }
  editReport(){
    this.http.post("api/Modules/EditReport",{},(res: any)=>{
      alert("Güncelleme işlem başarılı");
    },(error: any)=>{
      if(error.status==401){
        alert("Güncellemeye Yetkiniz yok");
      }
    });
  }
  addRoles(){
    var data ={
      name: this.roleName
    };
    this.http.post("api/Manager/AddRole",data,(res: any[])=>{
      this.http.post("api/Modules/GetRoles",{},(res: any[])=>{
        this.roles = res;
        this.selectRoles = this.roles.map(role => {
          return {id:role.id, value: role.name };
        });
      })
    });
  };
  login(){
    this.http.post("api/Auth/Login",{emailOrUserName:this.emailOrUserName,password:this.password},(res: any)=>{
      localStorage.removeItem('token');
        localStorage.setItem('token',res.data.token);
        
        this.http.post("api/Modules/GetUser",{},(res: any)=>{
          localStorage.removeItem('user');
         localStorage.setItem('user',JSON.stringify(res));
          
        });
        this.http.post("api/Modules/GetUsers",{},(res: any[])=>{
          this.users = res;
        });
    })  
  }
  setVisible(enumValue: any): boolean {
    var userModules = JSON.parse(localStorage.getItem('user')!);
   
    if (userModules.modules.includes(enumValue.toString())) {
        return true;
    }
    if (userModules.parents.includes(enumValue.toString())) {
      return true;
  }
    return false;
}
  ngOnInit() {
    var token = localStorage.getItem('token');
    if(token){
      this.decode=jwtDecode(token!!);
      this.userId=this.decode.Id;
    }
    this.http.post("api/Modules/GetModulesWithChildrenAndParents",{},(res: any[])=>{
      this.modules = res;
      this.selectModules = this.modules.map(module => {
        return {id:module.entityId, value: module.name };
      });
    })
    this.http.post("api/Modules/GetRoles",{},(res: any[])=>{
      this.roles = res;
      this.selectRoles = this.roles.map(role => {
        return {id:role.id, value: role.name };
      });
    })
    this.http.post("api/Modules/GetUsers",{},(res: any[])=>{
      this.users = res;
    })
  }
  addModule(roleId: number) {
    const select = this.moduleSelect2.nativeElement;
    const selectedValues = Array.from(select.selectedOptions).map((option) => parseInt(option.value));
    const data = { roleId: roleId, moduleIds: selectedValues };
    this.http.post("api/Modules/AddRoleModules", data, (res: any[]) => {
      for (let i = 0; i < select.options.length; i++) {
        select.options[i].selected = false;
      }
      const event = new Event('change');
      select.dispatchEvent(event);
      this.http.post("api/Modules/GetRoles",{},(res: any[])=>{
        this.roles = res;
      })
      this.http.post("api/Modules/GetUsers",{},(res: any[])=>{
        this.users = res;
      });
    });
  }
  addRole(userId:number){
    const select = this.roleSelect2.nativeElement;
    const selectedValues = Array.from(select.selectedOptions).map((option) => parseInt(option.value));
    const data = { userId: userId, roleIds: selectedValues };
    this.http.post("api/Modules/AddUserRoles", data, (res: any[]) => {
      for (let i = 0; i < select.options.length; i++) {
        select.options[i].selected = false;
      }
      const event = new Event('change');
      select.dispatchEvent(event);
      this.http.post("api/Modules/GetUsers",{},(res: any[])=>{
        this.users = res;
      })
    });
  }
}
