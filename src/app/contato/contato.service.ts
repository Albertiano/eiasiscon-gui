import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';
import { EmpresaService } from '../empresa/empresa.service';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) {}

  loadRegistros (props): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc',
        filter: props.filter,
        empresa: this.empresaService.getEmpresaAtiva().id
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/contato`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/contato/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/contato`, registro);
  }

}
