import { Component } from '@angular/core';
import { Asset, AssetService } from '../../services/asset.service';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule],
  providers: [AssetService],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.css',
})
export class AssetListComponent {
  constructor(private assetService: AssetService) {}
  assets: Asset[] = [];

  ngOnInit() {
    this.getAssets();
  }

  getAssets() {
    this.assetService
      .getAllAssets()
      .subscribe((assets: Asset[]) => (this.assets = assets));
  }
}
