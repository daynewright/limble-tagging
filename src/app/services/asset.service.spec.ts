import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { Asset, AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;
  let httpMock: HttpTestingController;

  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'pump',
      description: 'the pump',
      taskIds: ['1', '2', '3'],
    },
    {
      id: '2',
      name: 'valve',
      description: 'the valve',
      taskIds: ['3', '4', '5'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AssetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('can create assetService', () => {
    expect(service).toBeTruthy();
  });

  it('should get all assets', () => {
    service.getAllAssets().subscribe((assets) => {
      expect(assets).toEqual(mockAssets);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/assets`);
    expect(req.request.method).toBe('GET');

    req.flush(mockAssets);
  });

  it('should get an asset by id', () => {
    const assetId = mockAssets[0].id;

    service.getAssetById(assetId).subscribe((asset) => {
      expect(asset).toEqual(mockAssets[0]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/assets/${assetId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockAssets[0]);
  });
});
