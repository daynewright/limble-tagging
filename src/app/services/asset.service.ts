import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Asset {
  id: string;
  name: string;
  description?: string;
  taskIds?: string[];
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

  getAssetById(assetId: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.assetUrl}/${assetId}`);
  }
}
