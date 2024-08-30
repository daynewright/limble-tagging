import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Asset {
  id: number;
  name: string;
  description?: string;
  taskIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(private http: HttpClient) {}
  private assetUrl = `${environment.apiUrl}/assets`;

  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.assetUrl);
  }

  getAssetById(assetId: number): Observable<Asset> {
    return this.http.get<Asset>(`${this.assetUrl}/${assetId}`);
  }
}
