import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Attribute, Response } from '../model';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {
  private readonly path = 'posts/attributes';

  constructor(private http: HttpClient) {}

  findByPerson(userId: string) {
    return this.http.get<Response<Attribute[]>>(`${this.path}/${userId}`);
  }

  addAttribute(attribute: Attribute) {
    return this.http.post<Response<Attribute>>(`${this.path}`, attribute);
  }

  editAttribute(attribute: Attribute) {
    return this.http.put<Response<Attribute>>(`${this.path}/${attribute.id}`, attribute);
  }

  deleteAttribute(attribute: Attribute) {
    return this.http.delete<Response<Attribute>>(`${this.path}/${attribute.id}`);
  }
}
